<?php
require_once __DIR__ . '/backend/app/Config/Env.php';
require_once __DIR__ . '/backend/app/Config/Database.php';

use App\Config\Database;

$database = new Database();
$db = $database->getConnection();

try {
    echo "Starting database cleanup...\n";

    // 1. Delete duplicate psychotest records, keeping only the latest one (highest ID) for each application_id
    echo "1. Cleaning up duplicate psychotest records...\n";
    $cleanupSql = "DELETE p1 FROM psychotests p1
                  INNER JOIN psychotests p2 
                  WHERE p1.id < p2.id 
                  AND p1.application_id = p2.application_id";
    $db->exec($cleanupSql);
    echo "Duplicates removed.\n";

    // 2. Add UNIQUE constraint to application_id to prevent future duplicates
    echo "2. Adding UNIQUE constraint to application_id...\n";
    try {
        $db->exec("ALTER TABLE psychotests ADD UNIQUE INDEX unique_application_id (application_id)");
        echo "UNIQUE constraint added successfully.\n";
    } catch (\Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate key name') !== false) {
            echo "UNIQUE constraint already exists.\n";
        } else {
            throw $e;
        }
    }

    echo "Cleanup finished successfully!\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
