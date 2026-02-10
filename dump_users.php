<?php
require_once __DIR__ . '/backend/app/config/database.php';
use App\Config\Database;

$db = (new Database())->getConnection();
$stmt = $db->query("SELECT * FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($users, JSON_PRETTY_PRINT);
