<?php

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\ResponseHelper;
use App\Middleware\AuthMiddleware;
use PDO;

class UserController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getProfile() {
        $user = AuthMiddleware::authenticate();
        
        $query = "SELECT id, name, email, phone, photo, role, nik, religion, height, weight, 
                         birth_place, birth_date, 
                         ktp_address, ktp_rt, ktp_rw, ktp_kelurahan, ktp_kecamatan, ktp_city, ktp_kabupaten,
                         domicile_address, domicile_rt, domicile_rw, domicile_kelurahan, domicile_kecamatan, domicile_city, domicile_kabupaten,
                         last_education, major, gpa, skills, email_verified_at, phone_verified_at 
                  FROM users WHERE id = :id";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $user['id']);
        $stmt->execute();
        
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        ResponseHelper::success("Profile fetched", $profile);
    }

    public function updateProfile() {
        $user = AuthMiddleware::authenticate();
        $data = json_decode(file_get_contents("php://input"), true);

        // Allowed fields to update
        $fields = [
            'name', 'email', 'nik', 'religion', 'height', 'weight', 'birth_place', 'birth_date',
            'ktp_address', 'ktp_rt', 'ktp_rw', 'ktp_kelurahan', 'ktp_kecamatan', 'ktp_city', 'ktp_kabupaten',
            'domicile_address', 'domicile_rt', 'domicile_rw', 'domicile_kelurahan', 'domicile_kecamatan', 'domicile_city', 'domicile_kabupaten',
            'last_education', 'major', 'gpa', 'skills'
        ];

        // Restrict fields for ADMIN (MVP)
        if ($user['role'] === 'ADMIN') {
            $fields = ['name', 'email', 'phone'];
        }

        // Check if phone can be updated (only if not verified)
        $query = "SELECT phone_verified_at FROM users WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $user['id']);
        $stmt->execute();
        $currUser = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($currUser['phone_verified_at'] === null && isset($data['phone'])) {
            $fields[] = 'phone';
        }

        $updateParts = [];
        $params = [':id' => $user['id']];

        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $val = $data[$field];
                
                // Sanitize numeric fields: remove "cm", "kg", etc.
                if (in_array($field, ['height', 'weight'])) {
                    $val = preg_replace('/[^0-9]/', '', $val);
                }
                if ($field === 'gpa') {
                    $val = preg_replace('/[^0-9.]/', '', str_replace(',', '.', $val));
                }

                // Convert empty strings to null for specific database types
                if ($val === "" && in_array($field, ['height', 'weight', 'gpa', 'birth_date', 'nik'])) {
                    $val = null;
                }
                $updateParts[] = "$field = :$field";
                $params[":$field"] = $val;
            }
        }

        if (empty($updateParts)) {
            ResponseHelper::error("No fields to update");
        }

        try {
            $query = "UPDATE users SET " . implode(", ", $updateParts) . " WHERE id = :id";
            $stmt = $this->db->prepare($query);
            
            if ($stmt->execute($params)) {
                ResponseHelper::success("Profile updated successfully");
            } else {
                ResponseHelper::error("Failed to update profile", 500);
            }
        } catch (\PDOException $e) {
            ResponseHelper::error("Database error: " . $e->getMessage(), 500);
        }
    }

    public function uploadPhoto() {
        $user = AuthMiddleware::authenticate();

        if (!isset($_FILES['photo'])) {
            ResponseHelper::error("No photo uploaded");
        }

        $file = $_FILES['photo'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        $maxSize = 2 * 1024 * 1024; // 2MB

        if (!in_array($file['type'], $allowedTypes)) {
            ResponseHelper::error("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
        }

        if ($file['size'] > $maxSize) {
            ResponseHelper::error("File size exceeds 2MB limit.");
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = "profile_" . $user['id'] . "_" . time() . "." . $ext;
        $uploadDir = __DIR__ . "/../../storage/uploads/profile/";
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $query = "UPDATE users SET photo = :photo WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $photoPath = "/storage/uploads/profile/" . $fileName;
            $stmt->bindParam(":photo", $photoPath);
            $stmt->bindParam(":id", $user['id']);
            $stmt->execute();

            ResponseHelper::success("Photo uploaded successfully", ["photo_url" => $photoPath]);
        } else {
            ResponseHelper::error("Failed to upload photo", 500);
        }
    }

    public function requestPhoneOtp() {
        $user = AuthMiddleware::authenticate();
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->phone)) {
            ResponseHelper::error("Phone number is required");
        }

        $otp = sprintf("%06d", mt_rand(1, 999999));
        $hashedOtp = password_hash($otp, PASSWORD_BCRYPT);
        $otpExpires = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        $query = "UPDATE users SET phone = :phone, phone_otp = :otp, phone_otp_expires_at = :expires WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":phone", $data->phone);
        $stmt->bindParam(":otp", $hashedOtp);
        $stmt->bindParam(":expires", $otpExpires);
        $stmt->bindParam(":id", $user['id']);

        if ($stmt->execute()) {
            // Log OTP for testing/verification
            $logDir = __DIR__ . "/../../storage/logs";
            if (!is_dir($logDir)) mkdir($logDir, 0777, true);
            $logFile = $logDir . "/otp.log";
            $timestamp = date('Y-m-d H:i:s');
            $logMessage = "[$timestamp] User ID: {$user['id']} | Phone: {$data->phone} | OTP: $otp\n";
            file_put_contents($logFile, $logMessage, FILE_APPEND);

            ResponseHelper::success("OTP sent to your phone (simulated)");
        } else {
            ResponseHelper::error("Failed to request OTP", 500);
        }
    }

    public function verifyPhone() {
        $user = AuthMiddleware::authenticate();
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->otp)) {
            ResponseHelper::error("OTP is required");
        }

        $query = "SELECT phone_otp, phone_otp_expires_at FROM users WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $user['id']);
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        if (password_verify($data->otp, $userData['phone_otp'])) {
            if (strtotime($userData['phone_otp_expires_at']) < time()) {
                ResponseHelper::error("OTP expired");
            }

            $query = "UPDATE users SET phone_verified_at = NOW(), phone_otp = NULL, phone_otp_expires_at = NULL WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":id", $user['id']);
            $stmt->execute();

            ResponseHelper::success("Phone number verified successfully. It can no longer be changed.");
        } else {
            ResponseHelper::error("Invalid OTP");
        }
    }

    public function getDocuments() {
        $user = AuthMiddleware::authenticate();
        
        try {
            $query = "SELECT cv_url, photo_url, portfolio_url, portfolio_link, ktp_url, other_url, paklaring_url 
                      FROM user_documents WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute([':user_id' => $user['id']]);
            
            $docs = $stmt->fetch(PDO::FETCH_ASSOC);
            ResponseHelper::success("Documents fetched", $docs ?: []);
        } catch (\Exception $e) {
            ResponseHelper::error("Failed to fetch documents: " . $e->getMessage(), 500);
        }
    }

    public function uploadDocuments() {
        $user = AuthMiddleware::authenticate();
        $uploadDir = __DIR__ . "/../../storage/uploads/documents/";
        
        try {
            $files = $_FILES;
            $docData = ['user_id' => $user['id']];
            $fields = [
                'cv' => ['field' => 'cv_url', 'types' => ['application/pdf'], 'label' => 'CV'],
                'pasFoto' => ['field' => 'photo_url', 'types' => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'label' => 'Pas Foto'],
                'portofolioFile' => ['field' => 'portfolio_url', 'types' => ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'label' => 'Portofolio'],
                'ktp' => ['field' => 'ktp_url', 'types' => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'label' => 'KTP'],
                'sertifikat' => ['field' => 'other_url', 'types' => ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'label' => 'Sertifikat'],
                'paklaring' => ['field' => 'paklaring_url', 'types' => ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'label' => 'Paklaring']
            ];

            $maxSize = 5 * 1024 * 1024; // 5MB

            foreach ($fields as $inputName => $config) {
                if (isset($files[$inputName])) {
                    $file = $files[$inputName];
                    $dbField = $config['field'];
                    $allowedTypes = $config['types'];
                    $label = $config['label'];

                    // Basic error check
                    if ($file['error'] !== UPLOAD_ERR_OK) {
                        continue;
                    }

                    // Size validation
                    if ($file['size'] > $maxSize) {
                        ResponseHelper::error("Ukuran file $label melebihi batas 5MB", 400);
                        return;
                    }

                    // Type validation using mime_content_type if available or just the uploaded type
                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $mimeType = finfo_file($finfo, $file['tmp_name']);
                    finfo_close($finfo);

                    if (!in_array($mimeType, $allowedTypes)) {
                        $extMsg = $inputName === 'cv' ? "PDF" : "Gambar (JPG/PNG/WEBP)";
                        ResponseHelper::error("Format file $label tidak valid. Harus berupa $extMsg", 400);
                        return;
                    }

                    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                    $fileName = $inputName . "_" . $user['id'] . "_" . time() . "." . $ext;
                    $targetPath = $uploadDir . $fileName;

                    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                        $docData[$dbField] = "/storage/uploads/documents/" . $fileName;
                    }
                }
            }

            if (count($docData) <= 1 && !isset($_POST['portfolioLink'])) {
                // Check if record exists, if so, it's fine (no changes)
                $checkQuery = "SELECT id FROM user_documents WHERE user_id = :user_id";
                $checkStmt = $this->db->prepare($checkQuery);
                $checkStmt->execute([':user_id' => $user['id']]);
                if ($checkStmt->fetch()) {
                    ResponseHelper::success("No changes made");
                    return;
                }
                ResponseHelper::error("No documents provided");
                return;
            }

            if (isset($_POST['portfolioLink'])) {
                $docData['portfolio_link'] = $_POST['portfolioLink'];
            }

            // Check if record exists
            $checkQuery = "SELECT id FROM user_documents WHERE user_id = :user_id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->execute([':user_id' => $user['id']]);
            $existing = $checkStmt->fetch();

            if ($existing) {
                $updateParts = [];
                foreach ($docData as $key => $value) {
                    if ($key !== 'user_id') $updateParts[] = "$key = :$key";
                }
                $query = "UPDATE user_documents SET " . implode(", ", $updateParts) . ", updated_at = NOW() WHERE user_id = :user_id";
            } else {
                $columns = implode(", ", array_keys($docData));
                $placeholders = ":" . implode(", :", array_keys($docData));
                $query = "INSERT INTO user_documents ($columns) VALUES ($placeholders)";
            }

            $stmt = $this->db->prepare($query);
            if ($stmt->execute($docData)) {
                ResponseHelper::success("Documents uploaded successfully", $docData);
            } else {
                ResponseHelper::error("Failed to upload documents", 500);
            }
        } catch (\Exception $e) {
            ResponseHelper::error("Error uploading documents: " . $e->getMessage(), 500);
        }
    }
    public function changePassword() {
        $user = AuthMiddleware::authenticate();
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->current_password) || !isset($data->new_password) || !isset($data->confirm_password)) {
            ResponseHelper::error("All fields are required");
        }

        if ($data->new_password !== $data->confirm_password) {
            ResponseHelper::error("New password and confirmation do not match");
        }
        
        if (strlen($data->new_password) < 6) {
             ResponseHelper::error("Password must be at least 6 characters");
        }

        // Verify current password
        $query = "SELECT password FROM users WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $user['id']);
        $stmt->execute();
        $currentUser = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!password_verify($data->current_password, $currentUser['password'])) {
            ResponseHelper::error("Incorrect current password", 401);
        }

        // Update password
        $newPasswordHash = password_hash($data->new_password, PASSWORD_BCRYPT);
        $updateQuery = "UPDATE users SET password = :password WHERE id = :id";
        $updateStmt = $this->db->prepare($updateQuery);
        $updateStmt->bindParam(":password", $newPasswordHash);
        $updateStmt->bindParam(":id", $user['id']);

        if ($updateStmt->execute()) {
            ResponseHelper::success("Password changed successfully");
        } else {
            ResponseHelper::error("Failed to change password", 500);
        }
    }
    public function getDashboardSummary() {
        $user = AuthMiddleware::authenticate();

        try {
            // 1. Profile Completeness (Shortened to Mandatory)
            $profileFields = [
                'name', 'phone', 'nik', 'birth_place', 'birth_date', 'religion', 'height', 'weight',
                'ktp_address', 'ktp_rt', 'ktp_rw', 'ktp_kabupaten', 'ktp_kecamatan', 'ktp_kelurahan',
                'domicile_address', 'domicile_rt', 'domicile_rw', 'domicile_kabupaten', 'domicile_kecamatan', 'domicile_kelurahan',
                'last_education', 'major', 'gpa', 'skills'
            ];

            $query = "SELECT " . implode(", ", $profileFields) . " FROM users WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->execute([':id' => $user['id']]);
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            $filledCount = 0;
            foreach ($profileFields as $field) {
                if (!empty($userData[$field])) $filledCount++;
            }
            $profilePercentage = round(($filledCount / count($profileFields)) * 100);

            // 2. Document Status
            $docQuery = "SELECT cv_url, photo_url, ktp_url FROM user_documents WHERE user_id = :id";
            $docStmt = $this->db->prepare($docQuery);
            $docStmt->execute([':id' => $user['id']]);
            $docs = $docStmt->fetch(PDO::FETCH_ASSOC);
            
            $isDocumentUploaded = ($docs && !empty($docs['cv_url']) && !empty($docs['photo_url']) && !empty($docs['ktp_url']));

            // 3. Application Status
            $appQuery = "SELECT COUNT(*) FROM applications WHERE user_id = :id";
            $appStmt = $this->db->prepare($appQuery);
            $appStmt->execute([':id' => $user['id']]);
            $hasApplied = $appStmt->fetchColumn() > 0;

            ResponseHelper::success("Dashboard summary fetched", [
                'profile_percentage' => $profilePercentage,
                'is_profile_complete' => ($profilePercentage >= 100),
                'is_document_uploaded' => $isDocumentUploaded,
                'has_applied' => $hasApplied
            ]);
        } catch (\Exception $e) {
            ResponseHelper::error("Failed to fetch dashboard summary: " . $e->getMessage(), 500);
        }
    }
}
