<?php

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\ResponseHelper;
use App\Helpers\JwtHelper;
use App\Helpers\EmailHelper;
use PDO;

class AuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function register() {
        try {
            $data = json_decode(file_get_contents("php://input"));

            if (!isset($data->name) || !isset($data->email) || !isset($data->phone) || !isset($data->password)) {
                ResponseHelper::error("Missing required fields (name, email, phone, password)");
            }

            // Check if email exists
            $query = "SELECT id FROM users WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":email", $data->email);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                ResponseHelper::error("Email already registered");
            }

            // Check if phone exists
            $query = "SELECT id FROM users WHERE phone = :phone LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":phone", $data->phone);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                ResponseHelper::error("Phone number already registered");
            }

            // Generate 6 digit OTP
            $otp = sprintf("%06d", mt_rand(1, 999999));
            $hashedOtp = password_hash($otp, PASSWORD_BCRYPT);
            $otpExpires = date('Y-m-d H:i:s', strtotime('+10 minutes'));

            // Create User
            $query = "INSERT INTO users (name, email, phone, password, email_otp, email_otp_expires_at) 
                      VALUES (:name, :email, :phone, :password, :otp, :expires)";
            
            $stmt = $this->db->prepare($query);
            $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);

            $stmt->bindParam(":name", $data->name);
            $stmt->bindParam(":email", $data->email);
            $stmt->bindParam(":phone", $data->phone);
            $stmt->bindParam(":password", $hashedPassword);
            $stmt->bindParam(":otp", $hashedOtp);
            $stmt->bindParam(":expires", $otpExpires);

            // Send OTP via Email
            $subject = "Verifikasi Email - MPB Karir";
            $body = "
                <h3>Halo, {$data->name}</h3>
                <p>Terima kasih telah mendaftar di MPB Karir. Berikut adalah kode verifikasi Anda:</p>
                <h2 style='letter-spacing: 5px; color: #2563EB;'>{$otp}</h2>
                <p>Kode ini berlaku selama 10 menit.</p>
                <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
            ";

            if ($stmt->execute()) {
                // Try to send email, log if fails but don't stop registration flow for MVP
                // In production, you might want to rollback if email fails.
                // For now, we assume if DB insert success, user is created.
                
                // Use EmailHelper
                EmailHelper::send($data->email, $subject, $body);

                ResponseHelper::success("Registration successful. Please check your email for verification code.", [
                    "email" => $data->email
                ], 201);
            } else {
                ResponseHelper::error("Internal Server Error (DB Insert Failed)", 500);
            }
        } catch (\PDOException $e) {
            error_log("Database Error in Register: " . $e->getMessage());
            if ($e->getCode() == 23000) {
                ResponseHelper::error("Email or Phone already exists", 409);
            }
            ResponseHelper::error("Database Error", 500);
        } catch (\Exception $e) {
            error_log("General Error in Register: " . $e->getMessage());
            ResponseHelper::error("Internal Server Error", 500);
        }
    }

    public function verifyEmail() {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->otp)) {
            ResponseHelper::error("Missing email or otp");
        }

        $query = "SELECT email_otp, email_otp_expires_at FROM users WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":email", $data->email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            ResponseHelper::error("User not found");
        }

        if (password_verify($data->otp, $user['email_otp'])) {
            if (strtotime($user['email_otp_expires_at']) < time()) {
                ResponseHelper::error("OTP expired");
            }

            // Update user
            $updateQuery = "UPDATE users SET email_verified_at = NOW(), email_otp = NULL, email_otp_expires_at = NULL WHERE email = :email";
            $updateStmt = $this->db->prepare($updateQuery);
            $updateStmt->bindParam(":email", $data->email);
            $updateStmt->execute();

            ResponseHelper::success("Email verified successfully");
        } else {
            ResponseHelper::error("Invalid OTP");
        }
    }

    public function login() {
        try {
            $data = json_decode(file_get_contents("php://input"));

            // Rate Limiting (Improved IP detection for shared hosting/proxies)
            $ip = $_SERVER['REMOTE_ADDR'];
            if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
            } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
                $ip = $_SERVER['HTTP_CLIENT_IP'];
            }

            $rateLimitFile = __DIR__ . "/../../storage/logs/login_attempts_" . md5($ip) . ".log";
            
            $attempts = 0;
            $lastAttempt = 0;

            if (file_exists($rateLimitFile)) {
                $content = file_get_contents($rateLimitFile);
                if (strpos($content, '|') !== false) {
                    list($attempts, $lastAttempt) = explode('|', $content);
                }
            }

            // Relaxed rate limit: 10 attempts per 15 mins
            if ($attempts >= 10 && (time() - $lastAttempt) < 900) {
                ResponseHelper::error("Too many login attempts. Please try again in 15 minutes.", 429);
            }

            if (!isset($data->email) || !isset($data->password)) {
                ResponseHelper::error("Missing email or password");
            }

            $query = "SELECT id, name, email, password, role, email_verified_at FROM users WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":email", $data->email);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($data->password, $user['password'])) {
                // Reset attempts on success
                if (file_exists($rateLimitFile)) {
                    unlink($rateLimitFile);
                }

                if ($user['email_verified_at'] === null) {
                    ResponseHelper::error("Please verify your email first", 403);
                }

                $token = JwtHelper::generate([
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "role" => $user['role']
                ]);

                ResponseHelper::success("Login successful", [
                    "token" => $token,
                    "user" => [
                        "id" => $user['id'],
                        "name" => $user['name'],
                        "email" => $user['email'],
                        "role" => $user['role']
                    ]
                ]);
            } else {
                // Increment failed attempts
                $attempts++;
                file_put_contents($rateLimitFile, $attempts . '|' . time());

                ResponseHelper::error("Invalid email or password", 401);
            }
        } catch (\PDOException $e) {
            error_log("Database Error in Login: " . $e->getMessage());
            ResponseHelper::error("Database Error", 500);
        } catch (\Exception $e) {
            error_log("General Error in Login: " . $e->getMessage());
            ResponseHelper::error("Internal Server Error", 500);
        }
    }
}
