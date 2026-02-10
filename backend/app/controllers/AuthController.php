<?php

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\ResponseHelper;
use App\Helpers\JwtHelper;
use PDO;

class AuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function register() {
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

        // Log OTP to file for local debugging
        $logMessage = "[" . date('Y-m-d H:i:s') . "] OTP for {$data->email}: {$otp}\n";
        file_put_contents(__DIR__ . "/../../storage/logs/otp.log", $logMessage, FILE_APPEND);

        if ($stmt->execute()) {
            ResponseHelper::success("Registration successful. Please verify your email.", [
                "email" => $data->email
            ], 201);
        } else {
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
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password)) {
            ResponseHelper::error("Missing email or password");
        }

        $query = "SELECT id, name, email, password, role, email_verified_at FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":email", $data->email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($data->password, $user['password'])) {
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
            ResponseHelper::error("Invalid email or password", 401);
        }
    }
}
