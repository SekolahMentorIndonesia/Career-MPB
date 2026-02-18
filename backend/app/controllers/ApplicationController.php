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
        try {
            AuthMiddleware::isAdmin();

            $query = "SELECT
                        a.id, a.user_id, a.job_id, a.status, a.created_at, a.rejected_at,
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
                        u.last_education as applicant_last_education,
                        u.gpa as applicant_gpa,
                        u.major as applicant_major,
                        u.skills as applicant_skills,
                        u.ktp_address as applicant_ktp_address,
                        u.ktp_rt as applicant_ktp_rt,
                        u.ktp_rw as applicant_ktp_rw,
                        u.ktp_kabupaten as applicant_ktp_kabupaten,
                        u.domicile_address as applicant_domicile_address,
                        u.domicile_rt as applicant_domicile_rt,
                        u.domicile_rw as applicant_domicile_rw,
                        u.domicile_kabupaten as applicant_domicile_kabupaten,
                        d.cv_url, d.ktp_url, d.photo_url, d.ijazah_url, d.transcript_url, d.other_url, d.paklaring_url, d.portfolio_url, d.portfolio_link,
                        j.title as job_title,
                        MAX(p.score) as psychotest_score,
                        MAX(p.results) as psychotest_results,
                        (SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('name', stage_name, 'status', status)), ']') 
                         FROM application_stages WHERE application_id = a.id) as stages
                      FROM applications a
                      JOIN users u ON a.user_id = u.id
                      JOIN jobs j ON a.job_id = j.id
                      LEFT JOIN user_documents d ON u.id = d.user_id
                      LEFT JOIN psychotests p ON a.id = p.application_id
                      GROUP BY a.id, a.user_id, a.job_id, a.status, a.created_at, a.rejected_at, 
                               u.name, u.email, u.photo, u.phone, u.nik, u.religion, u.height, u.weight, 
                               u.birth_place, u.birth_date, u.last_education, u.gpa, u.major, u.skills,
                               u.ktp_address, u.ktp_rt, u.ktp_rw, u.ktp_kabupaten,
                               u.domicile_address, u.domicile_rt, u.domicile_rw, u.domicile_kabupaten,
                               d.cv_url, d.ktp_url, d.photo_url, d.ijazah_url, d.transcript_url, d.other_url, d.paklaring_url, d.portfolio_url, d.portfolio_link,
                               j.title
                      ORDER BY a.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Decode JSON stages
            foreach ($applications as &$app) {
                $app['stages'] = json_decode($app['stages'] ?? '[]', true);
            }

            ResponseHelper::success("Applications fetched", $applications);
        } catch (\Exception $e) {
            error_log("Application Index Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function show($id) {
        try {
            AuthMiddleware::isAdmin();

            $query = "SELECT
                        a.id, a.user_id, a.job_id, a.status, a.created_at, a.rejected_at,
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
                        u.last_education as applicant_last_education,
                        u.gpa as applicant_gpa,
                        u.major as applicant_major,
                        u.skills as applicant_skills,
                        u.ktp_address as applicant_ktp_address,
                        u.ktp_rt as applicant_ktp_rt,
                        u.ktp_rw as applicant_ktp_rw,
                        u.ktp_kabupaten as applicant_ktp_kabupaten,
                        u.domicile_address as applicant_domicile_address,
                        u.domicile_rt as applicant_domicile_rt,
                        u.domicile_rw as applicant_domicile_rw,
                        u.domicile_kabupaten as applicant_domicile_kabupaten,
                        d.cv_url, d.ktp_url, d.photo_url, d.ijazah_url, d.transcript_url, d.other_url, d.paklaring_url, d.portfolio_url, d.portfolio_link,
                        j.title as job_title,
                        (SELECT MAX(score) FROM psychotests WHERE application_id = a.id) as psychotest_score,
                        (SELECT MAX(results) FROM psychotests WHERE application_id = a.id) as psychotest_results,
                        (SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('name', stage_name, 'status', status)), ']') 
                         FROM application_stages WHERE application_id = a.id) as stages
                      FROM applications a
                      JOIN users u ON a.user_id = u.id
                      JOIN jobs j ON a.job_id = j.id
                      LEFT JOIN user_documents d ON u.id = d.user_id
                      WHERE a.id = :id
                      LIMIT 1";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([':id' => $id]);
            $application = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($application) {
                $application['stages'] = json_decode($application['stages'] ?? '[]', true);
                ResponseHelper::success("Application found", $application);
            } else {
                ResponseHelper::error("Application not found", 404);
            }
        } catch (\Exception $e) {
            error_log("Application Show Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function myApplications() {
        try {
            $user = AuthMiddleware::authenticate();

            $query = "SELECT
                        a.id, a.user_id, a.job_id, a.status, a.created_at, a.rejected_at,
                        j.title as job_title,
                        (SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('name', stage_name, 'status', status)), ']') 
                         FROM application_stages WHERE application_id = a.id) as stages
                      FROM applications a
                      JOIN jobs j ON a.job_id = j.id
                      WHERE a.user_id = :user_id
                      ORDER BY a.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([':user_id' => $user['id']]);
            $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($applications as &$app) {
                $app['stages'] = json_decode($app['stages'] ?? '[]', true);
            }

            ResponseHelper::success("User applications fetched", $applications);
        } catch (\Exception $e) {
            error_log("My Applications Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function apply() {
        try {
            $user = AuthMiddleware::authenticate();
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data || empty($data['job_id'])) {
                ResponseHelper::error("Job ID is required", 400);
            }

            // 0. Check if user is admin/HR - they cannot apply
            $userQuery = "SELECT role FROM users WHERE id = :id";
            $userStmt = $this->db->prepare($userQuery);
            $userStmt->execute([':id' => $user['id']]);
            $userData = $userStmt->fetch(PDO::FETCH_ASSOC);

            if ($userData && strtoupper($userData['role']) === 'ADMIN') {
                ResponseHelper::error("Admin/HR tidak dapat melamar pekerjaan. Anda adalah pihak yang membuka lowongan.", 403);
            }

            // Check if already applied or rejected with cooldown
            $checkQuery = "SELECT id, status, rejected_at FROM applications WHERE user_id = :user_id AND job_id = :job_id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->execute([':user_id' => $user['id'], ':job_id' => $data['job_id']]);
            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                if ($existing['status'] === 'Ditolak') {
                    // Check cooldown (24 hours)
                    $rejectedAt = new \DateTime($existing['rejected_at']);
                    $now = new \DateTime();
                    $diff = $now->getTimestamp() - $rejectedAt->getTimestamp();
                    $cooldownSeconds = 24 * 3600;

                    if ($diff < $cooldownSeconds) {
                        $remainingSeconds = $cooldownSeconds - $diff;
                        $hours = floor($remainingSeconds / 3600);
                        $minutes = floor(($remainingSeconds % 3600) / 60);
                        ResponseHelper::error("Anda baru saja ditolak. Silakan tunggu {$hours} jam {$minutes} menit sebelum melamar lagi.", 429);
                        return;
                    } else {
                        // Cooldown expired, delete old application to allow new one
                        $delQuery = "DELETE FROM applications WHERE id = :id";
                        $delStmt = $this->db->prepare($delQuery);
                        $delStmt->execute([':id' => $existing['id']]);
                    }
                } else {
                    ResponseHelper::error("You have already applied for this job", 400);
                    return;
                }
            }

            $query = "INSERT INTO applications (user_id, job_id, status) VALUES (:user_id, :job_id, 'Administrasi')";
            $this->db->beginTransaction();
            $stmt = $this->db->prepare($query);
            
            if ($stmt->execute([':user_id' => $user['id'], ':job_id' => $data['job_id']])) {
                $appId = $this->db->lastInsertId();
                
                // Initialize stages
                $stages = ['Administrasi', 'Psikotes', 'Interview', 'Final'];
                foreach ($stages as $stageName) {
                    $status = ($stageName === 'Administrasi') ? 'pending' : 'locked';
                    $stageStmt = $this->db->prepare("INSERT INTO application_stages (application_id, stage_name, status) VALUES (?, ?, ?)");
                    $stageStmt->execute([$appId, $stageName, $status]);
                }

                $this->db->commit();
                ResponseHelper::success("Application submitted successfully", null, 201);
            } else {
                $this->db->rollBack();
                ResponseHelper::error("Failed to submit application", 500);
            }
        } catch (\Exception $e) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            error_log("Apply Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function getUserPsychotest() {
        try {
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
        } catch (\Exception $e) {
            error_log("Get Psychotest Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function updateStatus() {
        try {
            AuthMiddleware::isAdmin();
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data || empty($data['application_id']) || empty($data['status'])) {
                ResponseHelper::error("Application ID and status are required", 400);
            }

            $applicationId = $data['application_id'];
            $inputStatus = $data['status'] ?? '';
            $isRejected = ($data['action'] ?? '') === 'reject' || $inputStatus === 'Ditolak';
            $isAccepted = ($data['action'] ?? '') === 'accept' || $inputStatus === 'Diterima';

            $stages = ['Administrasi', 'Psikotes', 'Interview', 'Final'];
            
            // Normalize target stage name (Case insensitive check)
            $normalizedTarget = 'Administrasi';
            $upperInput = strtoupper(trim($inputStatus));

            if (in_array($upperInput, ['SELEKSI ADMINISTRASI', 'ADMINISTRASI', 'DIKIRIM', 'DITOLAK'])) {
                $normalizedTarget = 'Administrasi';
            } elseif (in_array($upperInput, ['TES PSIKOTES', 'PSIKOTES'])) {
                $normalizedTarget = 'Psikotes';
            } elseif ($upperInput === 'INTERVIEW') {
                $normalizedTarget = 'Interview';
            } elseif (in_array($upperInput, ['FINAL', 'DITERIMA'])) {
                $normalizedTarget = 'Final';
            }

            $targetIndex = array_search($normalizedTarget, $stages);
            if ($targetIndex === false) {
                ResponseHelper::error("Invalid stage name: " . $inputStatus, 400);
                return;
            }

            $this->db->beginTransaction();

            foreach ($stages as $index => $stageName) {
                $status = 'pending';
                
                if ($index < $targetIndex) {
                    $status = 'passed';
                } elseif ($index === $targetIndex) {
                    if ($isRejected) $status = 'rejected';
                    elseif ($isAccepted && $stageName === 'Final') $status = 'passed';
                    else $status = 'pending'; // Target stage is now active, not passed yet
                } else {
                    $status = ($isRejected) ? 'locked' : 'pending';
                }

                $stmt = $this->db->prepare("INSERT INTO application_stages (application_id, stage_name, status) 
                                          VALUES (:app_id, :name, :status) 
                                          ON DUPLICATE KEY UPDATE status = :status, updated_at = NOW()");
                $stmt->execute([
                    ':app_id' => $applicationId,
                    ':name' => $stageName,
                    ':status' => $status
                ]);
            }

            // Update main application table
            if ($isRejected) {
                // Determine which stage is being rejected. 
                // If the input status is a specific stage, use it. Otherwise use the application's current status if valid.
                $actualRejectedStage = $normalizedTarget;
                
                // If it's a general 'reject' without a specific stage change, we try to use the current status
                $appCheck = $this->db->prepare("SELECT status FROM applications WHERE id = :id");
                $appCheck->execute([':id' => $applicationId]);
                $currentAppStatus = $appCheck->fetchColumn();
                
                if ($currentAppStatus && in_array($currentAppStatus, $stages)) {
                    $actualRejectedStage = $currentAppStatus;
                }

                // Update the specific stage to 'rejected'
                $this->db->prepare("UPDATE application_stages SET status = 'rejected', updated_at = NOW() 
                                  WHERE application_id = :app_id AND stage_name = :stage")
                         ->execute([':app_id' => $applicationId, ':stage' => $actualRejectedStage]);

                $this->db->prepare("UPDATE applications SET status = 'Ditolak', rejected_at = NOW() WHERE id = :id")
                         ->execute([':id' => $applicationId]);
            } elseif ($isAccepted && $normalizedTarget === 'Final') {
                $this->db->prepare("UPDATE applications SET status = 'Diterima' WHERE id = :id")
                         ->execute([':id' => $applicationId]);
            } else {
                // Moving forward
                $this->db->prepare("UPDATE applications SET status = :status WHERE id = :id")
                         ->execute([':status' => $normalizedTarget, ':id' => $applicationId]);
            }

            // Fetch job details for notifications
            $jobQuery = "SELECT j.title, j.company FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = :id";
            $jobStmt = $this->db->prepare($jobQuery);
            $jobStmt->execute([':id' => $applicationId]);
            $job = $jobStmt->fetch(PDO::FETCH_ASSOC);
            $jobTitle = $job['title'] ?? 'Posisi';
            $companyName = $job['company'] ?? 'MPB Group';

            // Handle notifications
            if ($isRejected) {
                $this->sendNotification($applicationId, "Lamaran Ditolak - $jobTitle", "Maaf, lamaran Anda untuk posisi **$jobTitle** di **$companyName** belum dapat dilanjutkan ke tahap berikutnya. Terima kasih atas partisipasi Anda.");
            } elseif ($normalizedTarget === 'Psikotes') {
                $this->sendNotification($applicationId, "Seleksi Tahap Psikotes - $jobTitle", "Selamat! Anda lulus ke tahap Psikotes untuk posisi **$jobTitle** di **$companyName**. Mohon tunggu tim Recruitment kami menghubungi Anda melalui Gmail, WhatsApp, atau dashboard ini untuk jadwal dan langkah selanjutnya.");
                $this->db->prepare("INSERT IGNORE INTO psychotests (application_id) VALUES (:id)")->execute([':id' => $applicationId]);
            } elseif ($normalizedTarget === 'Interview') {
                $this->sendNotification($applicationId, "Undangan Interview - $jobTitle", "Selamat! Anda lulus ke tahap Interview untuk posisi **$jobTitle** di **$companyName**. Mohon tunggu tim Recruitment kami menghubungi Anda melalui Gmail, WhatsApp, atau dashboard ini untuk jadwal dan langkah selanjutnya.");
            } elseif ($isAccepted && $normalizedTarget === 'Final') {
                $notifTitle = "Lamaran DITERIMA! - $jobTitle";
                $notifMsg = "Selamat! Anda telah dinyatakan DITERIMA (Accepted) untuk posisi **$jobTitle** di **$companyName**. Mohon tunggu tim Recruitment kami menghubungi Anda melalui Gmail, WhatsApp, atau dashboard ini untuk proses Onboarding.";
                $this->sendNotification($applicationId, $notifTitle, $notifMsg);
            }

            $this->db->commit();
            ResponseHelper::success("Status updated successfully");

        } catch (\Exception $e) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            error_log("Update Status Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    private function sendNotification($appId, $title, $message) {
        $appQuery = "SELECT user_id FROM applications WHERE id = :id";
        $stmt = $this->db->prepare($appQuery);
        $stmt->execute([':id' => $appId]);
        $app = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($app) {
            $notifQuery = "INSERT INTO notifications (user_id, title, subject, message, type, is_read, created_at) 
                          VALUES (:user_id, :title, :title, :message, 'system', FALSE, NOW())";
            $this->db->prepare($notifQuery)->execute([
                ':user_id' => $app['user_id'],
                ':title' => $title,
                ':subject' => $title, // Using title as subject for system notifications
                ':message' => $message
            ]);
        }
    }

    public function generateLink() {
        try {
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
        } catch (\Exception $e) {
            error_log("Generate Link Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }
}
