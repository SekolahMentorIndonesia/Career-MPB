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
        $user = AuthMiddleware::authenticate();

        $query = "SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':user_id' => $user['id']]);
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

        ResponseHelper::success("Notifications fetched", $notifications);
    }

    public function markRead() {
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
    }
    public function send() {
        AuthMiddleware::isAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || empty($data['user_id']) || empty($data['title']) || empty($data['subject']) || empty($data['message'])) {
            ResponseHelper::error("All fields (user_id, title, subject, message) are required", 400);
        }

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
            ResponseHelper::success("Notification sent successfully");
        } else {
            ResponseHelper::error("Failed to send notification", 500);
        }
    }
}
