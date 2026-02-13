<?php
require_once __DIR__ . '/backend/app/config/Database.php';
// Mock Env class since it seems to be missing in direct execution
if (!class_exists('App\Config\Env')) {
    class MockEnv {
        public static function get($key, $default = null) {
            $envs = parse_ini_file(__DIR__ . '/backend/.env');
            return $envs[$key] ?? $default;
        }
    }
    class_alias('MockEnv', 'App\Config\Env');
}

use App\Config\Database;

try {
    $db = (new Database())->getConnection();
    
    echo "--- Table Schema application_stages ---\n";
    $stmt = $db->query("DESCRIBE application_stages");
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

    echo "\n--- Table Keys application_stages ---\n";
    $stmt = $db->query("SHOW KEYS FROM application_stages");
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

    echo "\n--- Recent Applications Status ---\n";
    $stmt = $db->query("SELECT id, user_id, job_id, status, created_at FROM applications ORDER BY id DESC LIMIT 5");
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

    echo "\n--- Application Stages for Latest App ---\n";
    $lastId = $db->query("SELECT id FROM applications ORDER BY id DESC LIMIT 1")->fetchColumn();
    if ($lastId) {
        $stmt = $db->prepare("SELECT * FROM application_stages WHERE application_id = ?");
        $stmt->execute([$lastId]);
        print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
