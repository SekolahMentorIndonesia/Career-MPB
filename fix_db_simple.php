<?php
$host = '127.0.0.1';
$db   = 'karir_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     
     // Check if rejected_at exists in applications
     $stmt = $pdo->query("SHOW COLUMNS FROM applications LIKE 'rejected_at'");
     if (!$stmt->fetch()) {
         $pdo->exec("ALTER TABLE applications ADD COLUMN rejected_at TIMESTAMP NULL AFTER status");
         echo "Column 'rejected_at' added successfully to 'applications' table.\n";
     } else {
         echo "Column 'rejected_at' already exists in 'applications'.\n";
     }

} catch (\PDOException $e) {
     echo "Error: " . $e->getMessage() . "\n";
}
