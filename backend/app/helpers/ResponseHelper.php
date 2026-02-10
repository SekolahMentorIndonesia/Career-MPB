<?php

namespace App\Helpers;

class ResponseHelper {
    public static function send($status, $message, $data = null, $httpCode = 200) {
        http_response_code($httpCode);
        header('Content-Type: application/json');
        
        $response = [
            'status' => $status,
            'success' => $status === 'success',
            'message' => $message
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response);
        exit;
    }

    public static function success($message, $data = null, $httpCode = 200) {
        self::send('success', $message, $data, $httpCode);
    }

    public static function error($message, $httpCode = 400, $data = null) {
        self::send('error', $message, $data, $httpCode);
    }
}
