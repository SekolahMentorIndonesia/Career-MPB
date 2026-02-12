<?php
require_once __DIR__ . '/backend/app/Config/Env.php';
require_once __DIR__ . '/backend/app/Config/Database.php';

use App\Config\Database;

$database = new Database();
$db = $database->getConnection();

try {
    echo "--- APPLICATIONS DATA ---\n";
    $query = "SELECT a.id, a.user_id, a.job_id, a.status, j.title as job_title 
              FROM applications a 
              JOIN jobs j ON a.job_id = j.id 
              ORDER BY a.created_at DESC LIMIT 5";
    $stmt = $db->query($query);
    $apps = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($apps);

    echo "\n--- STAGES DATA FOR LATEST APP ---\n";
    if (!empty($apps)) {
        $appId = $apps[0]['id'];
        $query = "SELECT * FROM application_stages WHERE application_id = $appId";
        $stmt = $db->query($query);
        print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
