<?php

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\ResponseHelper;
use App\Middleware\AuthMiddleware;
use PDO;

class AdminController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAllUsers() {
        try {
            AuthMiddleware::isAdmin();
            
            $query = "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            ResponseHelper::success("Users fetched", $users);
        } catch (\Exception $e) {
            error_log("GetAllUsers Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function exportUsers() {
        try {
            AuthMiddleware::isAdmin();

            $query = "SELECT * FROM users ORDER BY created_at DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($users)) {
                ResponseHelper::error("No data to export");
            }

            // Set headers for CSV download
            $filename = "users_export_" . date('Ymd_His') . ".csv";
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename=' . $filename);

            $output = fopen('php://output', 'w');

            // Column headers
            fputcsv($output, array_keys($users[0]));

            // Rows
            foreach ($users as $user) {
                fputcsv($output, $user);
            }

            fclose($output);
            exit;
        } catch (\Exception $e) {
            error_log("ExportUsers Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function sendNotification() {
        try {
            AuthMiddleware::isAdmin();
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data || empty($data['email']) || empty($data['message'])) {
                ResponseHelper::error("Email and message are required", 400);
            }

            $title = $data['title'] ?? 'Pemberitahuan Admin';
            $subject = $data['subject'] ?? 'Pesan Baru dari Admin';
            $channels = $data['channels'] ?? ['dashboard']; // Default to dashboard

            // Find user by email
            $userQuery = "SELECT id, name, email FROM users WHERE email = :email";
            $userStmt = $this->db->prepare($userQuery);
            $userStmt->execute([':email' => $data['email']]);
            $user = $userStmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                ResponseHelper::error("User with email not found", 404);
            }

            $results = [];
            
            // 1. Dashboard Channel
            if (in_array('dashboard', $channels)) {
                $query = "INSERT INTO notifications (user_id, title, subject, message, type, created_at) VALUES (:user_id, :title, :subject, :message, 'admin', NOW())";
                $stmt = $this->db->prepare($query);
                $dbSuccess = $stmt->execute([
                    ':user_id' => $user['id'],
                    ':title' => $title,
                    ':subject' => $subject,
                    ':message' => $data['message']
                ]);
                $results['dashboard'] = $dbSuccess;
            }

            // 2. Email Channel
            if (in_array('email', $channels)) {
                $emailBody = "
                    <div style='font-family: sans-serif; padding: 20px; color: #333;'>
                        <h2 style='color: #2563eb;'>$title</h2>
                        <p style='font-weight: bold;'>$subject</p>
                        <div style='background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                            " . nl2br(htmlspecialchars($data['message'])) . "
                        </div>
                        <p style='font-size: 12px; color: #666;'>Pesan ini dikirim secara otomatis oleh MPB Karir Recruitment Team.</p>
                    </div>
                ";
                
                // Use recruitment@multipriority.com as sender
                $emailSuccess = \App\Helpers\EmailHelper::send($user['email'], $subject, $emailBody);
                $results['email'] = $emailSuccess;
            }

            if (empty($results)) {
                ResponseHelper::error("No notification channel selected", 400);
                return;
            }

            $allSuccess = !in_array(false, array_values($results), true);
            
            if ($allSuccess) {
                ResponseHelper::success("Notification sent successfully via: " . implode(', ', array_keys($results)));
            } else {
                $failed = array_keys($results, false, true);
                ResponseHelper::error("Notification failed partially on: " . implode(', ', $failed), 500, $results);
            }
        } catch (\Exception $e) {
            error_log("SendNotification Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function getNotifications() {
        try {
            $adminUser = AuthMiddleware::isAdmin();
            
            // Fetch notifications but EXCLUDE those that this admin has hidden for themselves
            $query = "SELECT n.*, u.name as user_name, u.email as user_email 
                      FROM notifications n 
                      JOIN users u ON n.user_id = u.id 
                      LEFT JOIN admin_notification_exclusions ane ON n.id = ane.notification_id AND ane.admin_id = :admin_id
                      WHERE ane.notification_id IS NULL
                      ORDER BY n.created_at DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute([':admin_id' => $adminUser['id']]);
            
            $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
            ResponseHelper::success("Notifications fetched", $notifications);
        } catch (\Exception $e) {
            error_log("GetNotifications Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function hideNotification() {
        try {
            $adminUser = AuthMiddleware::isAdmin();
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data || empty($data['notification_id'])) {
                ResponseHelper::error("Notification ID is required", 400);
            }

            $query = "INSERT IGNORE INTO admin_notification_exclusions (admin_id, notification_id) VALUES (:admin_id, :notification_id)";
            $stmt = $this->db->prepare($query);
            $success = $stmt->execute([
                ':admin_id' => $adminUser['id'],
                ':notification_id' => $data['notification_id']
            ]);

            if ($success) {
                ResponseHelper::success("Notification hidden for you");
            } else {
                ResponseHelper::error("Failed to hide notification");
            }
        } catch (\Exception $e) {
            error_log("HideNotification Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    // public function deleteNotificationForAll($id) {
    //     try {
    //         AuthMiddleware::isAdmin();

    //         if (!$id) {
    //             ResponseHelper::error("Notification ID is required", 400);
    //         }

    //         $query = "DELETE FROM notifications WHERE id = :id";
    //         $stmt = $this->db->prepare($query);
    //         $success = $stmt->execute([':id' => $id]);

    //         if ($success) {
    //             ResponseHelper::success("Notification deleted for everyone");
    //         } else {
    //             ResponseHelper::error("Failed to delete notification");
    //         }
    //     } catch (\Exception $e) {
    //         error_log("DeleteNotificationForAll Error: " . $e->getMessage());
    //         ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
    //     }
    // }

    public function getDashboardStats() {
        AuthMiddleware::isAdmin();

        try {
            // Stats counts
            $totalApplicants = $this->db->query("SELECT COUNT(DISTINCT user_id) FROM applications")->fetchColumn();
            $totalUsers = $this->db->query("SELECT COUNT(*) FROM users WHERE role IS NULL OR UPPER(role) != 'ADMIN'")->fetchColumn();
            $passed = $this->db->query("SELECT COUNT(*) FROM applications WHERE status = 'Diterima'")->fetchColumn();
            $failed = $this->db->query("SELECT COUNT(*) FROM applications WHERE status = 'Ditolak'")->fetchColumn();
            $inProgress = $this->db->query("SELECT COUNT(*) FROM applications WHERE status NOT IN ('Diterima', 'Ditolak')")->fetchColumn();

            // Recent activity (Last 5 applications)
            $activityQuery = "SELECT a.created_at, u.name as user_name, j.title as job_title 
                             FROM applications a 
                             JOIN users u ON a.user_id = u.id 
                             JOIN jobs j ON a.job_id = j.id 
                             ORDER BY a.created_at DESC LIMIT 5";
            $activities = $this->db->query($activityQuery)->fetchAll(PDO::FETCH_ASSOC);

            ResponseHelper::success("Dashboard stats fetched", [
                'total_applicants' => (int)$totalApplicants,
                'total_users' => (int)$totalUsers,
                'passed' => (int)$passed,
                'failed' => (int)$failed,
                'in_progress' => (int)$inProgress,
                'recent_activities' => $activities
            ]);
        } catch (\Exception $e) {
            ResponseHelper::error("Failed to fetch dashboard stats: " . $e->getMessage(), 500);
        }
    }
}
