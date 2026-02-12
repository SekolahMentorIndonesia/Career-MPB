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
    
    echo "Adding 'last_status' column to 'applications' table...\n";
    
    // Check if column exists first
    $check = $db->query("SHOW COLUMNS FROM applications LIKE 'last_status'");
    if ($check->rowCount() == 0) {
        $db->exec("ALTER TABLE applications ADD COLUMN last_status VARCHAR(50) DEFAULT NULL AFTER status");
        echo "Column 'last_status' added successfully.\n";
    } else {
        echo "Column 'last_status' already exists.\n";
    }
    
    // Also ensure ENUM is broadened as per previous fix (for local testing)
    echo "Verifying ENUM for status column...\n";
    $db->exec("ALTER TABLE applications MODIFY COLUMN status ENUM('Administrasi', 'Seleksi Administrasi', 'Tes Psikotes', 'Psikotes', 'Interview', 'Diterima', 'Ditolak') DEFAULT 'Seleksi Administrasi'");
    echo "ENUM verified.\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
