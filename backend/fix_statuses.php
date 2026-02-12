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
    // Load Environment Variables
    Env::load(__DIR__ . '/.env');
    
    $db = (new Database())->getConnection();
    
    echo "Starting status migration...\n";
    
    // Update 'Administrasi' to 'Seleksi Administrasi'
    $query = "UPDATE applications SET status = 'Seleksi Administrasi' WHERE status = 'Administrasi'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $count = $stmt->rowCount();
    echo "Successfully updated $count records from 'Administrasi' to 'Seleksi Administrasi'.\n";
    
    echo "Migration completed successfully.\n";
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
