<?php
// ULTRA-STANDALONE DEBUG SCRIPT
// Simpan di: backend/public/emergency_debug.php
// Akses di: https://recruitment.multipriority.com/backend/emergency_debug.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/plain');

echo "--- EMERGENCY DEBUG ---\n\n";

echo "PHP Version: " . phpversion() . "\n";
echo "Current Directory: " . __DIR__ . "\n";

// 1. Cek Folder Dasar
$folders = ['../app', '../app/Controllers', '../app/Helpers', '../.env'];
foreach ($folders as $f) {
    if (file_exists(__DIR__ . '/' . $f)) {
        echo "FOUND: $f\n";
        if (is_dir(__DIR__ . '/' . $f)) {
            echo "   (is directory)\n";
            // List conten for case-sensitivity check
            $files = scandir(__DIR__ . '/' . $f);
            echo "   Contents: " . implode(', ', $files) . "\n";
        }
    } else {
        echo "MISSING: $f\n";
    }
}

// 2. Test Koneksi DB Manual (Tanpa Class App)
echo "\nTesting Database Connection:\n";
$envContent = @file_get_contents(__DIR__ . '/../.env');
if ($envContent) {
    preg_match('/DB_HOST=(.*)/', $envContent, $host);
    preg_match('/DB_NAME=(.*)/', $envContent, $name);
    preg_match('/DB_USER=(.*)/', $envContent, $user);
    preg_match('/DB_PASS=(.*)/', $envContent, $pass);
    
    $h = trim($host[1] ?? '');
    $n = trim($name[1] ?? '');
    $u = trim($user[1] ?? '');
    $p = trim($pass[1] ?? '');
    
    echo "Host: $h, DB: $n, User: $u\n";
    
    try {
        $dsn = "mysql:host=$h;dbname=$n;charset=utf8mb4";
        $pdo = new PDO($dsn, $u, $p);
        echo "SUCCESS: Database connected.\n";
    } catch (Exception $e) {
        echo "FAILED: " . $e->getMessage() . "\n";
    }
} else {
    echo "FAILED: Could not read .env to get credentials.\n";
}

echo "\n--- END DEBUG ---";
