<?php
require_once __DIR__ . '/backend/app/Config/Env.php';
require_once __DIR__ . '/backend/app/Config/Database.php';

use App\Config\Database;

$database = new Database();
$db = $database->getConnection();

try {
    echo "--- CHECKING TABLE: jobs ---\n";
    $stmt = $db->query("DESCRIBE jobs");
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
