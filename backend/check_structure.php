<?php
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/env.php';

use App\Config\Database;
use App\Config\Env;

Env::load(__DIR__ . '/.env');

try {
    $db = (new Database())->getConnection();
    $res = $db->query("DESCRIBE applications")->fetchAll(PDO::FETCH_ASSOC);
    echo "APPLICATIONS TABLE STRUCTURE:\n";
    print_r($res);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
