<?php
require_once __DIR__ . '/backend/app/Config/Env.php';
require_once __DIR__ . '/backend/app/Config/Database.php';

use App\Config\Database;

$database = new Database();
$db = $database->getConnection();

try {
    echo "--- CHECKING TABLE: application_stages ---\n";
    $stmt = $db->query("SHOW TABLES LIKE 'application_stages'");
    if ($stmt->rowCount() === 0) {
        echo "CRITICAL: Table 'application_stages' does not exist!\n";
    } else {
        echo "Table exists.\n";
        $stmt = $db->query("DESCRIBE application_stages");
        print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
        
        echo "\n--- CHECKING DATA FOR DIMAS PRATAMA (Interview) ---\n";
        $query = "SELECT a.id, a.status, (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', stage_name, 'status', status)) FROM application_stages WHERE application_id = a.id) as stages_json
                  FROM applications a 
                  WHERE a.status = 'Interview' OR a.status = 'INTERVIEW'
                  LIMIT 5";
        $stmt = $db->query($query);
        print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

        echo "\n--- RAW STAGES DATA FOR LATEST INTERVIEW APP ---\n";
        $query = "SELECT * FROM application_stages WHERE application_id IN (SELECT id FROM applications WHERE status = 'Interview' OR status = 'INTERVIEW') ORDER BY application_id DESC LIMIT 20";
        $stmt = $db->query($query);
        print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
