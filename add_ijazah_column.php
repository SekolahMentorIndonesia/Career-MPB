<?php
require_once __DIR__ . '/backend/app/Config/Env.php';
require_once __DIR__ . '/backend/app/Config/Database.php';

use App\Config\Database;

$database = new Database();
$db = $database->getConnection();

try {
    echo "--- ADDING COLUMN: ijazah_url to user_documents ---\n";
    $sql = "ALTER TABLE user_documents ADD COLUMN ijazah_url VARCHAR(255) DEFAULT NULL AFTER ktp_url;";
    
    $db->exec($sql);
    echo "Column 'ijazah_url' added successfully.\n";

} catch (\Exception $e) {
    if (strpos($e->getMessage(), "Duplicate column name") !== false) {
        echo "Column 'ijazah_url' already exists.\n";
    } else {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
}
