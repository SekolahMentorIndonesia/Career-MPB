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
        AuthMiddleware::isAdmin();
        
        $query = "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        ResponseHelper::success("Users fetched", $users);
    }

    public function exportUsers() {
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
    }

    public function sendNotification() {
        AuthMiddleware::isAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || empty($data['email']) || empty($data['message'])) {
            ResponseHelper::error("Email and message are required", 400);
        }

        // Find user by email
        $userQuery = "SELECT id FROM users WHERE email = :email";
        $userStmt = $this->db->prepare($userQuery);
        $userStmt->execute([':email' => $data['email']]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            ResponseHelper::error("User with email not found", 404);
        }

        $query = "INSERT INTO notifications (user_id, message, created_at) VALUES (:user_id, :message, NOW())";
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute([':user_id' => $user['id'], ':message' => $data['message']])) {
            ResponseHelper::success("Notification sent successfully");
        } else {
            ResponseHelper::error("Failed to send notification", 500);
        }
    }
    public function getDashboardStats() {
        AuthMiddleware::isAdmin();

        try {
            // Stats counts
            $totalApplicants = $this->db->query("SELECT COUNT(*) FROM applications")->fetchColumn();
            $inPsychotest = $this->db->query("SELECT COUNT(*) FROM applications WHERE status = 'Psikotes' OR status = 'Tes Psikotes'")->fetchColumn();
            $passed = $this->db->query("SELECT COUNT(*) FROM psychotests WHERE results = 'A' OR results = 'B' OR results = 'C'")->fetchColumn();
            $failed = $this->db->query("SELECT COUNT(*) FROM psychotests WHERE results = 'D' OR results = 'E'")->fetchColumn();

            // Recent activity (Last 5 applications)
            $activityQuery = "SELECT a.created_at, u.name as user_name, j.title as job_title 
                             FROM applications a 
                             JOIN users u ON a.user_id = u.id 
                             JOIN jobs j ON a.job_id = j.id 
                             ORDER BY a.created_at DESC LIMIT 5";
            $activities = $this->db->query($activityQuery)->fetchAll(PDO::FETCH_ASSOC);

            ResponseHelper::success("Dashboard stats fetched", [
                'total_applicants' => (int)$totalApplicants,
                'in_psychotest' => (int)$inPsychotest,
                'passed' => (int)$passed,
                'failed' => (int)$failed,
                'recent_activities' => $activities
            ]);
        } catch (\Exception $e) {
            ResponseHelper::error("Failed to fetch dashboard stats: " . $e->getMessage(), 500);
        }
    }
}
