<?php
require_once 'backend/app/config/Env.php';
require_once 'backend/app/config/Database.php';

use App\Config\Database;

try {
    $db = (new Database())->getConnection();
    
    // Check if column already exists
    $checkQuery = "SHOW COLUMNS FROM applications LIKE 'rejected_at'";
    $stmt = $db->query($checkQuery);
    
    if ($stmt->rowCount() == 0) {
        // Add rejected_at column
        $db->exec("ALTER TABLE applications ADD COLUMN rejected_at DATETIME NULL");
        echo "✓ Added 'rejected_at' column to applications table\n";
    } else {
        echo "- 'rejected_at' column already exists\n";
    }
    
    echo "\nMigration completed successfully!\n";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
