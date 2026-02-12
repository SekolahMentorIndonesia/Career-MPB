<?php
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/app/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

use App\Config\Database;
use App\Config\Env;

try {
    Env::load(__DIR__ . '/.env');
    $db = (new Database())->getConnection();
    
    echo "Altering applications table status ENUM...\n";
    
    // 1. Broaden ENUM
    $alterQuery = "ALTER TABLE applications MODIFY COLUMN status ENUM('Administrasi', 'Seleksi Administrasi', 'Tes Psikotes', 'Psikotes', 'Interview', 'Diterima', 'Ditolak') DEFAULT 'Seleksi Administrasi'";
    $db->exec($alterQuery);
    echo "ENUM broadened successfully.\n";
    
    // 2. Migrate existing 'Administrasi' to 'Seleksi Administrasi'
    $updateQuery = "UPDATE applications SET status = 'Seleksi Administrasi' WHERE status = 'Administrasi'";
    $stmt = $db->prepare($updateQuery);
    $stmt->execute();
    $count = $stmt->rowCount();
    echo "Migrated $count records from 'Administrasi' to 'Seleksi Administrasi'.\n";
    
    // 3. Check specific applicant ID 4 if it exists locally (for verification)
    $stmt = $db->prepare("SELECT id, status FROM applications WHERE id = 4");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo "Applicant #4 Current Status: " . $row['status'] . "\n";
    } else {
        echo "Applicant #4 not found in local DB.\n";
    }

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
