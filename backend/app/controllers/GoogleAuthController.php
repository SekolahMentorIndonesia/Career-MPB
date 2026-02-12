<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\ResponseHelper;
use App\Helpers\JwtHelper;
use App\Config\Env;
use PDO;

class GoogleAuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    /**
     * Handle Google OAuth login/registration
     * POST /api/auth/google
     * 
     * Expected body: { "credential": "google_id_token" }
     */
    public function googleLogin() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!isset($data['credential']) || empty($data['credential'])) {
                ResponseHelper::error("Google credential is required", 400);
                return;
            }

            $idToken = $data['credential'];

            // Verify token with Google
            $googleUser = $this->verifyGoogleToken($idToken);

            if (!$googleUser) {
                ResponseHelper::error("Invalid Google token", 401);
                return;
            }

            // Check if email is verified by Google (Relaxed for MVP)
            // if (!isset($googleUser['email_verified']) || $googleUser['email_verified'] !== true) {
            //     ResponseHelper::error("Email not verified by Google", 403);
            //     return;
            // }

            $email = $googleUser['email'];
            $googleId = $googleUser['sub']; // Google user ID
            $name = $googleUser['name'] ?? explode('@', $email)[0];

            // Check if user exists
            $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // User exists - log them in
                // Update google_id if not set
                if (empty($user['google_id'])) {
                    $updateQuery = "UPDATE users SET google_id = :google_id, provider = 'google', email_verified_at = NOW() WHERE id = :id";
                    $updateStmt = $this->db->prepare($updateQuery);
                    $updateStmt->execute([
                        ':google_id' => $googleId,
                        ':id' => $user['id']
                    ]);
                }

                // Generate JWT token
                $token = JwtHelper::generate([
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]);

                ResponseHelper::success("Login successful", [
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'photo' => $user['photo']
                    ]
                ]);
            } else {
                // User doesn't exist - create new account
                $insertQuery = "INSERT INTO users (name, email, password, provider, google_id, phone, email_verified_at, role, created_at) 
                               VALUES (:name, :email, NULL, 'google', :google_id, NULL, NOW(), 'USER', NOW())";
                
                $insertStmt = $this->db->prepare($insertQuery);
                $insertStmt->execute([
                    ':name' => $name,
                    ':email' => $email,
                    ':google_id' => $googleId
                ]);

                $userId = $this->db->lastInsertId();

                // Generate JWT token for new user
                $token = JwtHelper::generate([
                    'id' => $userId,
                    'email' => $email,
                    'role' => 'USER'
                ]);

                ResponseHelper::success("Account created successfully", [
                    'token' => $token,
                    'user' => [
                        'id' => $userId,
                        'name' => $name,
                        'email' => $email,
                        'role' => 'USER',
                        'photo' => null
                    ]
                ], 201);
            }

        } catch (\Throwable $e) {
            error_log("Google Login Error: " . $e->getMessage());
            ResponseHelper::error("Server error: " . $e->getMessage(), 500);
        }
    }

    /**
     * Verify Google ID token with Google's tokeninfo endpoint
     * CRITICAL: This MUST be done server-side, NEVER trust frontend
     * 
     * @param string $idToken
     * @return array|false Google user data or false if invalid
     */
    private function verifyGoogleToken($idToken) {
        $clientId = Env::get('GOOGLE_CLIENT_ID');

        if (empty($clientId)) {
            error_log("GOOGLE_CLIENT_ID not configured in .env");
            return false;
        }

        // Verify token with Google
        $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($idToken);

        // Use cURL for better compatibility on shared hosting
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("cURL Error verifying Google token: " . $error);
            return false;
        }

        if ($httpCode !== 200) {
            error_log("Google token verification failed with HTTP code: " . $httpCode);
            return false;
        }

        $tokenInfo = json_decode($response, true);

        if (!$tokenInfo || !isset($tokenInfo['email'])) {
            error_log("Invalid token info response from Google");
            return false;
        }

        // Verify the token is for our app
        if ($tokenInfo['aud'] !== $clientId) {
            error_log("Token audience mismatch. Expected: $clientId, Got: " . $tokenInfo['aud']);
            return false;
        }

        // Verify token is not expired
        if (isset($tokenInfo['exp']) && time() > $tokenInfo['exp']) {
            error_log("Google token has expired");
            return false;
        }

        return $tokenInfo;
    }
}
