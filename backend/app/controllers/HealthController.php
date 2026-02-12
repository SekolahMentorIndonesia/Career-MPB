<?php
namespace App\Controllers;

use App\Config\Database;
use App\Config\Env;
use App\Helpers\ResponseHelper;
use PDO;

class HealthController {
    public function check() {
        $results = [
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'env_loaded' => !empty(Env::get('DB_NAME')),
            'db_connection' => false,
            'db_error' => null,
            'tables' => []
        ];

        try {
            $database = new Database();
            $db = $database->getConnection();
            
            if ($db) {
                $results['db_connection'] = true;
                $stmt = $db->query("SHOW TABLES");
                $results['tables'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
            } else {
                $results['db_error'] = "getConnection() returned null";
            }
        } catch (\Exception $e) {
            $results['db_error'] = $e->getMessage();
        }

        ResponseHelper::success("Health check completed", $results);
    }
}
