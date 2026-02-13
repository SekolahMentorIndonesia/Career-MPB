<?php
// FILE: backend/update_db_enum.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/app/Config/Env.php';
require_once __DIR__ . '/app/Config/Database.php';

use App\Config\Env;
use App\Config\Database;

try {
    Env::load(__DIR__ . '/.env');
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) throw new Exception("Database connection failed.");

    echo "--- Updating Applications Enum ---\n";

    // 1. Broaden the ENUM to include 'Final' and 'Interview' properly
    $sql = "ALTER TABLE applications MODIFY COLUMN status 
            ENUM('Administrasi', 'Psikotes', 'Interview', 'Final', 'Diterima', 'Ditolak') 
            DEFAULT 'Administrasi'";
    $db->exec($sql);
    echo "ENUM broadened successfully.\n";

    // 2. Normalize existing data (e.g., 'Seleksi Administrasi' -> 'Administrasi')
    echo "Normalizing current statuses...\n";
    
    // Multiple variations of Administrasi
    $db->exec("UPDATE applications SET status = 'Administrasi' WHERE status IN ('Seleksi Administrasi', 'Dikirim')");
    
    // Variations of Psikotes
    $db->exec("UPDATE applications SET status = 'Psikotes' WHERE status = 'Tes Psikotes'");
    
    echo "Existing statuses normalized.\n";

    echo "\n--- SUCCESS! Database updated ---\n";

} catch (Exception $e) {
    echo "\n[ERROR]: " . $e->getMessage() . "\n";
}
