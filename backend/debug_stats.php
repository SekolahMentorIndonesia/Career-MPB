<?php
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/env.php';

use App\Config\Database;
use App\Config\Env;

Env::load(__DIR__ . '/.env');

try {
    $db = (new Database())->getConnection();
    $res = $db->query("SELECT status, COUNT(*) as count FROM applications GROUP BY status")->fetchAll(PDO::FETCH_ASSOC);
    echo "STATUS COUNTS:\n";
    print_r($res);
    
    $recent = $db->query("SELECT a.id, u.name, a.status FROM applications a JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    echo "\nRECENT APPLICATIONS:\n";
    print_r($recent);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
