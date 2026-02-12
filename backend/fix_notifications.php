<?php
require_once __DIR__ . '/app/Config/Env.php';
require_once __DIR__ . '/app/Config/Database.php';

use App\Config\Env;
use App\Config\Database;

// Load Env
Env::load(__DIR__ . '/.env');

echo "Starting Notifications Table Fix...\n";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        die("Connection failed!\n");
    }

    $queries = [
        "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT NULL AFTER user_id",
        "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS subject VARCHAR(255) DEFAULT NULL AFTER title",
        "ALTER TABLE notifications MODIFY message TEXT NOT NULL",
        "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'system' AFTER message",
        "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read TINYINT(1) DEFAULT 0 AFTER type"
    ];

    foreach ($queries as $query) {
        try {
            $db->exec($query);
            echo "Executed: $query\n";
        } catch (PDOException $e) {
            echo "Info: " . $e->getMessage() . "\n";
        }
    }

    echo "Notifications table fix completed successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
