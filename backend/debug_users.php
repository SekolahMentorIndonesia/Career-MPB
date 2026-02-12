<?php
require_once 'app/Config/Env.php';
require_once 'app/Config/Database.php';
use App\Config\Database;

$database = new Database();
$db = $database->getConnection();

echo "Debug Users Table Role:\n";
try {
    $stmt = $db->query("SELECT id, name, role FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($users as $user) {
        echo "ID: " . $user['id'] . " | Name: " . $user['name'] . " | Role: [" . var_export($user['role'], true) . "]\n";
    }
    
    echo "\nStats Query Test:\n";
    $count = $db->query("SELECT COUNT(*) FROM users WHERE role IS NULL OR UPPER(role) != 'ADMIN'")->fetchColumn();
    echo "Count Result: " . $count . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
