<?php
require_once __DIR__ . '/backend/app/Config/Database.php';

use App\Config\Database;

$db = (new Database())->getConnection();

try {
    $sql = "CREATE TABLE IF NOT EXISTS admin_notification_exclusions (
        admin_id INT NOT NULL,
        notification_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_VALUE() NOT NULL,
        PRIMARY KEY (admin_id, notification_id),
        FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    // Fix CURRENT_VALUE() to CURRENT_TIMESTAMP if needed, but let's use standard syntax
    $sql = "CREATE TABLE IF NOT EXISTS admin_notification_exclusions (
        admin_id INT NOT NULL,
        notification_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (admin_id, notification_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

    $db->exec($sql);
    echo "Table 'admin_notification_exclusions' created successfully.\n";
} catch (PDOException $e) {
    echo "Error creating table: " . $e->getMessage() . "\n";
}
