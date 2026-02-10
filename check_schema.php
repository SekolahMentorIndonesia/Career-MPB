<?php
require_once __DIR__ . '/backend/app/Config/Database.php';
use App\Config\Database;

$db = new Database();
$conn = $db->getConnection();

$stmt = $conn->prepare("DESCRIBE jobs");
$stmt->execute();
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($columns as $col) {
    if (in_array($col['Field'], ['id', 'title', 'type', 'location'])) {
        print_r($col);
    }
}
