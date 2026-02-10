<?php

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\ResponseHelper;
use App\Middleware\AuthMiddleware;
use PDO;

class ApplicationController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function index() {
        AuthMiddleware::isAdmin();

        $query = "SELECT
                    a.*,
                    u.name as applicant_name,
                    u.email as applicant_email,
                    u.photo as applicant_photo,
                    u.phone as applicant_phone,
                    u.nik as applicant_nik,
                    u.religion as applicant_religion,
                    u.height as applicant_height,
                    u.weight as applicant_weight,
                    u.birth_place as applicant_birth_place,
                    u.birth_date as applicant_birth_date,
                    u.ktp_address as applicant_ktp_address,
                    u.ktp_rt as applicant_ktp_rt,
                    u.ktp_rw as applicant_ktp_rw,
                    u.ktp_kelurahan as applicant_ktp_kelurahan,
                    u.ktp_kecamatan as applicant_ktp_kecamatan,
                    u.ktp_city as applicant_ktp_city,
                    u.ktp_kabupaten as applicant_ktp_kabupaten,
                    u.domicile_address as applicant_domicile_address,
                    u.domicile_rt as applicant_domicile_rt,
                    u.domicile_rw as applicant_domicile_rw,
                    u.domicile_kelurahan as applicant_domicile_kelurahan,
                    u.domicile_kecamatan as applicant_domicile_kecamatan,
                    u.domicile_city as applicant_domicile_city,
                    u.domicile_kabupaten as applicant_domicile_kabupaten,
                    u.last_education as applicant_last_education,
                    u.major as applicant_major,
                    u.gpa as applicant_gpa,
                    u.skills as applicant_skills,
                    j.title as job_title,
                    p.id as psychotest_id,
                    p.score as psychotest_score,
                    p.results as psychotest_results,
                    p.link as psychotest_link,
                    d.cv_url,
                    d.photo_url,
                    d.ktp_url,
                    d.portfolio_url,
                    d.portfolio_link,
                    d.other_url as sertifikat_url,
                    d.paklaring_url
                  FROM applications a
                  JOIN users u ON a.user_id = u.id
                  JOIN jobs j ON a.job_id = j.id
                  LEFT JOIN psychotests p ON a.id = p.application_id
                  LEFT JOIN user_documents d ON u.id = d.user_id
                  ORDER BY a.created_at DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

        ResponseHelper::success("Applications fetched", $applications);
    }

    public function myApplications() {
        $user = AuthMiddleware::authenticate();

        $query = "SELECT
                    a.*,
                    j.title as job_title
                  FROM applications a
                  JOIN jobs j ON a.job_id = j.id
                  WHERE a.user_id = :user_id
                  ORDER BY a.created_at DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([':user_id' => $user['id']]);
        $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

        ResponseHelper::success("User applications fetched", $applications);
    }

    public function apply() {
        $user = AuthMiddleware::authenticate();
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || empty($data['job_id'])) {
            ResponseHelper::error("Job ID is required", 400);
        }

        // 1. Validation Profile Completeness (Shortened)
        $profileFields = [
            'name', 'phone', 'nik', 'birth_place', 'birth_date', 
            'ktp_address', 'ktp_kabupaten', 'last_education', 'major'
        ];
        
        $userQuery = "SELECT * FROM users WHERE id = :id";
        $userStmt = $this->db->prepare($userQuery);
        $userStmt->execute([':id' => $user['id']]);
        $userData = $userStmt->fetch(PDO::FETCH_ASSOC);

        foreach ($profileFields as $field) {
            if (empty($userData[$field])) {
                ResponseHelper::error("Profil Anda belum lengkap. Silakan lengkapi data diri di menu Profile.", 403);
            }
        }

        // 2. Validation Documents (Mandatory: CV, Pas Foto, KTP)
        $docQuery = "SELECT cv_url, photo_url, ktp_url FROM user_documents WHERE user_id = :id";
        $docStmt = $this->db->prepare($docQuery);
        $docStmt->execute([':id' => $user['id']]);
        $docs = $docStmt->fetch(PDO::FETCH_ASSOC);

        if (!$docs || empty($docs['cv_url']) || empty($docs['photo_url']) || empty($docs['ktp_url'])) {
            ResponseHelper::error("Dokumen wajib (CV, Pas Foto, KTP) belum lengkap. Silakan unggah di menu Dokumen.", 422);
        }

        // Check if already applied
        $checkQuery = "SELECT id FROM applications WHERE user_id = :user_id AND job_id = :job_id";
        $checkStmt = $this->db->prepare($checkQuery);
        $checkStmt->execute([':user_id' => $user['id'], ':job_id' => $data['job_id']]);
        
        if ($checkStmt->fetch()) {
            ResponseHelper::error("You have already applied for this job", 400);
        }

        $query = "INSERT INTO applications (user_id, job_id, status) VALUES (:user_id, :job_id, 'Administrasi')";
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute([':user_id' => $user['id'], ':job_id' => $data['job_id']])) {
            ResponseHelper::success("Application submitted successfully", null, 201);
        } else {
            ResponseHelper::error("Failed to submit application", 500);
        }
    }

    public function getUserPsychotest() {
        $user = AuthMiddleware::authenticate();
        
        // Find the latest application and its psychotest link
        $query = "SELECT p.*, a.status 
                  FROM applications a 
                  LEFT JOIN psychotests p ON a.id = p.application_id 
                  WHERE a.user_id = :user_id 
                  ORDER BY a.created_at DESC LIMIT 1";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([':user_id' => $user['id']]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            ResponseHelper::success("Psychotest data fetched", $data);
        } else {
            ResponseHelper::error("No psychotest data found", 404);
        }
    }

    public function updateStatus() {
        AuthMiddleware::isAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || empty($data['application_id']) || empty($data['status'])) {
            ResponseHelper::error("Application ID and status are required", 400);
        }

        $query = "UPDATE applications SET status = :status WHERE id = :id";
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute([':status' => $data['status'], ':id' => $data['application_id']])) {
            
            // If moved to Psikotes, create entry in psychotests if not exists
            if ($data['status'] === 'Tes Psikotes' || $data['status'] === 'Psikotes') {
                $psQuery = "INSERT IGNORE INTO psychotests (application_id) VALUES (:id)";
                $psStmt = $this->db->prepare($psQuery);
                $psStmt->execute([':id' => $data['application_id']]);

                // Auto-send notification for Psikotes
                $appQuery = "SELECT user_id FROM applications WHERE id = :id";
                $appStmt = $this->db->prepare($appQuery);
                $appStmt->execute([':id' => $data['application_id']]);
                $app = $appStmt->fetch(PDO::FETCH_ASSOC);

                if ($app) {
                    $notifTitle = "Seleksi Tahap Psikotes";
                    $notifSubject = "Undangan Tes Psikotes";
                    $notifMsg = "Selamat! Anda telah lolos ke tahap Psikotes. Silakan cek menu 'Psikotes' di dashboard Anda untuk mengerjakan tes.";
                    
                    $notifQuery = "INSERT INTO notifications (user_id, title, subject, message, type, is_read, created_at) VALUES (:user_id, :title, :subject, :message, 'system', FALSE, NOW())";
                    $notifStmt = $this->db->prepare($notifQuery);
                    $notifStmt->execute([
                        ':user_id' => $app['user_id'],
                        ':title' => $notifTitle,
                        ':subject' => $notifSubject,
                        ':message' => $notifMsg
                    ]);
                }
            }

            ResponseHelper::success("Status updated to " . $data['status']);
        } else {
            ResponseHelper::error("Failed to update status", 500);
        }
    }

    public function generateLink() {
        AuthMiddleware::isAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || empty($data['application_id']) || empty($data['link'])) {
            ResponseHelper::error("Application ID and link are required", 400);
        }

        // Get user_id for notification
        $userQuery = "SELECT user_id, job_id FROM applications WHERE id = :id";
        $userStmt = $this->db->prepare($userQuery);
        $userStmt->execute([':id' => $data['application_id']]);
        $app = $userStmt->fetch(PDO::FETCH_ASSOC);

        if (!$app) {
            ResponseHelper::error("Application not found", 404);
        }

        // Update psychotest link
        $query = "UPDATE psychotests SET link = :link WHERE application_id = :id";
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute([':link' => $data['link'], ':id' => $data['application_id']])) {
            
            // Send notification to user
            $notifMsg = "Link psikotes Anda sudah tersedia. Silakan cek menu Psikotes untuk memulai pengerjaan.";
            $notifQuery = "INSERT INTO notifications (user_id, message) VALUES (:user_id, :message)";
            $notifStmt = $this->db->prepare($notifQuery);
            $notifStmt->execute([':user_id' => $app['user_id'], ':message' => $notifMsg]);

            ResponseHelper::success("Psikotes link generated and user notified");
        } else {
            ResponseHelper::error("Failed to generate link", 500);
        }
    }
}
