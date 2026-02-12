<?php
require_once __DIR__ . '/backend/app/Config/Database.php';

use App\Config\Database;

try {
    $db = (new Database())->getConnection();
    
    // Check if rejected_at exists
    $stmt = $db->query("SHOW COLUMNS FROM applications LIKE 'rejected_at'");
    if (!$stmt->fetch()) {
        $db->exec("ALTER TABLE applications ADD COLUMN rejected_at TIMESTAMP NULL AFTER status");
        echo "Column 'rejected_at' added successfully to 'applications' table.\n";
    } else {
        echo "Column 'rejected_at' already exists.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
