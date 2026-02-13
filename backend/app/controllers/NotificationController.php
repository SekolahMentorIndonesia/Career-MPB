<?php

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\ResponseHelper;
use App\Middleware\AuthMiddleware;
use PDO;

class NotificationController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function index() {
        try {
            $user = AuthMiddleware::authenticate();

            $query = "SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute([':user_id' => $user['id']]);
            $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

            ResponseHelper::success("Notifications fetched", $notifications);
        } catch (\Exception $e) {
            error_log("Notification Index Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function markRead() {
        try {
            $user = AuthMiddleware::authenticate();
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data || empty($data['notification_id'])) {
                ResponseHelper::error("Notification ID is required", 400);
            }

            $query = "UPDATE notifications SET is_read = TRUE WHERE id = :id AND user_id = :user_id";
            $stmt = $this->db->prepare($query);
            
            if ($stmt->execute([':id' => $data['notification_id'], ':user_id' => $user['id']])) {
                ResponseHelper::success("Notification marked as read");
            } else {
                ResponseHelper::error("Failed to mark as read", 500);
            }
        } catch (\Exception $e) {
            error_log("MarkRead Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }
    public function send() {
        try {
            AuthMiddleware::isAdmin();
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data || empty($data['user_id']) || empty($data['title']) || empty($data['subject']) || empty($data['message'])) {
                ResponseHelper::error("All fields (user_id, title, subject, message) are required", 400);
            }

            $channels = $data['channels'] ?? ['dashboard']; // Default to dashboard if not specified

            // Fetch user email if email channel is selected
            $userEmail = null;
            if (in_array('email', $channels)) {
                $stmtUser = $this->db->prepare("SELECT email, name FROM users WHERE id = :id");
                $stmtUser->execute([':id' => $data['user_id']]);
                $userData = $stmtUser->fetch(PDO::FETCH_ASSOC);
                
                if ($userData) {
                    $userEmail = $userData['email'];
                }
            }

            // 1. Handle Email Sending
            $emailSent = false;
            if (in_array('email', $channels) && $userEmail) {
                try {
                    // Use a slightly formatted body for email
                    $emailBody = "
                        <h3>{$data['title']}</h3>
                        <p><strong>{$data['subject']}</strong></p>
                        <hr>
                        <p>" . nl2br(htmlspecialchars($data['message'])) . "</p>
                        <br>
                        <p><small>Dikirim dari sistem Recruitment - MPB Group</small></p>
                    ";
                    
                    if (\App\Helpers\EmailHelper::send($userEmail, $data['title'], $emailBody)) {
                        $emailSent = true;
                    }
                } catch (\Exception $e) {
                    error_log("Failed to send email notif: " . $e->getMessage());
                    // We don't fail the whole request if email fails, but we log it.
                }
            }

            // 2. Handle Dashboard Notification
            $dashboardSent = false;
            if (in_array('dashboard', $channels)) {
                $query = "INSERT INTO notifications (user_id, title, subject, message, type, is_read, created_at) 
                          VALUES (:user_id, :title, :subject, :message, :type, FALSE, NOW())";
                $stmt = $this->db->prepare($query);

                $type = $data['type'] ?? 'manual';
                
                if ($stmt->execute([
                    ':user_id' => $data['user_id'],
                    ':title' => $data['title'],
                    ':subject' => $data['subject'],
                    ':message' => $data['message'],
                    ':type' => $type
                ])) {
                    $dashboardSent = true;
                }
            }

            // Response logic
            if ($dashboardSent || $emailSent) {
                $msg = "Notification processed.";
                if ($dashboardSent && $emailSent) $msg = "Notifikasi dikirim ke Dashboard dan Email.";
                elseif ($dashboardSent) $msg = "Notifikasi dikirim ke Dashboard.";
                elseif ($emailSent) $msg = "Notifikasi dikirim ke Email.";

                ResponseHelper::success($msg);
            } else {
                ResponseHelper::error("Failed to process notification (No valid channel selected or errors occurred)", 500);
            }

        } catch (\Exception $e) {
            error_log("Notification Send Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        try {
            AuthMiddleware::isAdmin();
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data || empty($data['title']) || empty($data['subject']) || empty($data['message'])) {
                ResponseHelper::error("Title, subject, and message are required", 400);
            }

            $query = "UPDATE notifications SET title = :title, subject = :subject, message = :message WHERE id = :id";
            $stmt = $this->db->prepare($query);
            
            if ($stmt->execute([
                ':title' => $data['title'],
                ':subject' => $data['subject'],
                ':message' => $data['message'],
                ':id' => $id
            ])) {
                ResponseHelper::success("Notification updated successfully");
            } else {
                ResponseHelper::error("Failed to update notification", 500);
            }
        } catch (\Exception $e) {
            error_log("Notification Update Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    // public function delete($id) {
    //     try {
    //         AuthMiddleware::isAdmin();

    //         $query = "DELETE FROM notifications WHERE id = :id";
    //         $stmt = $this->db->prepare($query);
            
    //         if ($stmt->execute([':id' => $id])) {
    //             ResponseHelper::success("Notification deleted successfully");
    //         } else {
    //             ResponseHelper::error("Failed to delete notification", 500);
    //         }
    //     } catch (\Exception $e) {
    //         error_log("Notification Delete Error: " . $e->getMessage());
    //         ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
    //     }
    // }

    // public function deleteForUser($id) {
    //     try {
    //         $user = AuthMiddleware::authenticate();

    //         // Verify ownership
    //         $checkQuery = "SELECT id FROM notifications WHERE id = :id AND user_id = :user_id";
    //         $checkStmt = $this->db->prepare($checkQuery);
    //         $checkStmt->execute([':id' => $id, ':user_id' => $user['id']]);

    //         if ($checkStmt->rowCount() === 0) {
    //             ResponseHelper::error("Notification not found or access denied", 404);
    //             return;
    //         }

    //         $query = "DELETE FROM notifications WHERE id = :id AND user_id = :user_id";
    //         $stmt = $this->db->prepare($query);
            
    //         if ($stmt->execute([':id' => $id, ':user_id' => $user['id']])) {
    //             ResponseHelper::success("Notification deleted successfully");
    //         } else {
    //             ResponseHelper::error("Failed to delete notification", 500);
    //         }
    //     } catch (\Exception $e) {
    //         error_log("User Notification Delete Error: " . $e->getMessage());
    //         ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
    //     }
    // }
}
