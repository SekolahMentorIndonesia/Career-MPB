<?php
// ROOT LEVEL DEBUG SCRIPT
// Simpan di: public_html/debug.php
// Akses di: https://recruitment.multipriority.com/debug.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>PHP DEBUG STATUS</h1>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Current Dir: " . __DIR__ . "<br>";

// Cek PDO
echo "PDO MySQL: " . (extension_loaded('pdo_mysql') ? "ENABLED" : "MISSING") . "<br>";
echo "cURL: " . (function_exists('curl_init') ? "ENABLED" : "MISSING") . "<br>";

// Cek .env
$envFile = __DIR__ . '/backend/.env';
echo "Checking .env at: $envFile<br>";
if (file_exists($envFile)) {
    echo "SUCCESS: .env exists.<br>";
    $lines = file($envFile);
    foreach ($lines as $line) {
        if (strpos($line, 'GOOGLE_CLIENT_ID') !== false) {
            echo "SUCCESS: GOOGLE_CLIENT_ID found.<br>";
        }
    }
} else {
    echo "ERROR: .env not found in /backend folder.<br>";
}

// Cek permissions
$storage = __DIR__ . '/backend/storage/logs';
if (is_writable($storage)) {
    echo "SUCCESS: Storage is writable.<br>";
} else {
    echo "ERROR: Storage is NOT writable. Set permissions to 775 or 755.<br>";
}
