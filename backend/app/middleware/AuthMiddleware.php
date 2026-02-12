<?php

namespace App\Middleware;

use App\Helpers\JwtHelper;
use App\Helpers\ResponseHelper;

class AuthMiddleware {
    public static function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $payload = JwtHelper::verify($token);
            
            if ($payload) {
                return $payload;
            }
        }

        ResponseHelper::error("Unauthorized", 401);
    }

    public static function isAdmin() {
        $user = self::authenticate();
        if (strtoupper($user['role']) !== 'ADMIN') {
            ResponseHelper::error("Forbidden: Admin access required", 403);
        }
        return $user;
    }
}
