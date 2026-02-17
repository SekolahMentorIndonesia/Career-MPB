<?php

namespace App\Middleware;

use App\Helpers\JwtHelper;
use App\Helpers\ResponseHelper;

class AuthMiddleware {
    public static function authenticate() {
        $authHeader = '';
        
        // Priority 1: getallheaders (most common)
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        // Priority 2: apache_request_headers (Apache specific)
        if (empty($authHeader) && function_exists('apache_request_headers')) {
            $apacheHeaders = apache_request_headers();
            $authHeader = $apacheHeaders['Authorization'] ?? $apacheHeaders['authorization'] ?? '';
        }

        // Priority 3: Server variables (Hostinger/CGI fallback)
        if (empty($authHeader)) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? 
                          $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? 
                          $_SERVER['HTTP_X_AUTHORIZATION'] ?? 
                          $_SERVER['REDIRECT_HTTP_X_AUTHORIZATION'] ??
                          $_SERVER['AUTHORIZATION'] ??
                          $_SERVER['Authorization'] ??
                          '';
        }

        // Priority 4: apache_lookup_uri fallback
        if (empty($authHeader) && function_exists('apache_lookup_uri')) {
             $info = apache_lookup_uri($_SERVER['REQUEST_URI']);
             if (isset($info->headers_in['Authorization'])) {
                 $authHeader = $info->headers_in['Authorization'];
             }
        }

        if (preg_match('/Bearer\s+([^,\s]+)/i', $authHeader, $matches)) {
            $token = trim($matches[1]);
            
            // Defend against common "null" or "undefined" token accidents from frontend
            if ($token === 'null' || $token === 'undefined' || empty($token)) {
                error_log("Auth Failed: Token is string 'null' or 'undefined' or empty.");
                ResponseHelper::error("Unauthorized: Invalid token format", 401);
                return;
            }

            $payload = JwtHelper::verify($token);
            
            if ($payload) {
                return $payload;
            } else {
                error_log("Auth Failed: Token verification failed for token: " . substr($token, 0, 10) . "...");
            }
        }

        // Detailed Debugging for Hostinger persistence issues
        $debugInfo = [
            'has_auth_header' => !empty($authHeader),
            'header_start' => substr($authHeader, 0, 15),
            'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
            'method' => $_SERVER['REQUEST_METHOD'] ?? 'N/A'
        ];
        error_log("Auth Middleware 401: " . json_encode($debugInfo));

        ResponseHelper::error("Unauthorized", 401);
    }

    public static function isAdmin() {
        $user = self::authenticate();
        $role = strtoupper(trim($user['role'] ?? ''));
        if ($role !== 'ADMIN') {
            ResponseHelper::error("Forbidden: Admin access required", 403);
        }
        return $user;
    }
}
