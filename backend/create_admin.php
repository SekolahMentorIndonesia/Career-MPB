<?php

require_once __DIR__ . '/app/Config/Env.php';
require_once __DIR__ . '/app/Config/Database.php';

use App\Config\Env;
use App\Config\Database;

// Load Environment Variables
Env::load(__DIR__ . '/.env');

if (php_sapi_name() !== 'cli') {
    die("This script must be run from the command line.");
}

echo "--- MPB Karir Admin Creator ---\n";

// Get inputs
$name = readline("Enter Admin Name (e.g. Administrator): ");
$email = readline("Enter Admin Email (e.g. admin@karyawan.web.id): ");
$phone = readline("Enter Admin Phone (e.g. 08123456789): ");
$password = readline("Enter Admin Password: ");

if (empty($name) || empty($email) || empty($phone) || empty($password)) {
    die("Error: All fields are required.\n");
}

try {
    $db = (new Database())->getConnection();

    // Check if email exists
    $checkStmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $checkStmt->execute([':email' => $email]);
    
    if ($checkStmt->fetch()) {
        die("Error: Email already exists!\n");
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $sql = "INSERT INTO users (name, email, phone, password, role, email_verified_at) 
            VALUES (:name, :email, :phone, :password, 'ADMIN', NOW())";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':password' => $hashedPassword
    ]);

    echo "\n[SUCCESS] Admin account created successfully!\n";
    echo "Email: $email\n";
    echo "Password: (hidden)\n";
    echo "Role: ADMIN\n";
    echo "Status: Verified\n";
    echo "\nNow you can export your database and upload it to Hostinger.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
