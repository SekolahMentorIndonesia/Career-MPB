<?php
require_once __DIR__ . '/app/config/Env.php';
require_once __DIR__ . '/app/config/Database.php';

use App\Config\Database;

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $stmt = $db->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Columns in 'users' table:\n";
    foreach ($columns as $column) {
        echo "- " . $column['Field'] . " (" . $column['Type'] . ")\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
