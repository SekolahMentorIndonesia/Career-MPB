<?php
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/env.php';

use App\Config\Database;
use App\Config\Env;

Env::load(__DIR__ . '/.env');

try {
    $db = (new Database())->getConnection();
    $res = $db->query("SELECT id, status, last_status, rejected_at FROM applications WHERE status = 'Ditolak'")->fetchAll(PDO::FETCH_ASSOC);
    echo "REJECTED APPLICATIONS DETAIL:\n";
    print_r($res);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
