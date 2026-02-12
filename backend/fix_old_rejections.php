<?php
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/env.php';

use App\Config\Database;
use App\Config\Env;

Env::load(__DIR__ . '/.env');

try {
    $db = (new Database())->getConnection();
    
    echo "Updating old rejected applications...\n";
    
    // 1. If application is rejected but has a psychotest entry with results/score, 
    // it means it was rejected at 'Psikotes' stage or later.
    $sql1 = "UPDATE applications a
            JOIN psychotests p ON a.id = p.application_id
            SET a.last_status = 'Psikotes'
            WHERE a.status = 'Ditolak' 
            AND (a.last_status IS NULL OR a.last_status = '')
            AND (p.score IS NOT NULL OR p.results IS NOT NULL)";
    $count1 = $db->exec($sql1);
    echo "Fixed $count1 applications that had psychotest results.\n";
    
    // 2. If rejected but has no psychotest yet, it was likely rejected at 'Seleksi Administrasi' stage.
    // (This is the default fallback, but we can set it explicitly to avoid nulls).
    $sql2 = "UPDATE applications 
            SET last_status = 'Seleksi Administrasi'
            WHERE status = 'Ditolak' 
            AND (last_status IS NULL OR last_status = '')";
    $count2 = $db->exec($sql2);
    echo "Fixed $count2 other applications to 'Seleksi Administrasi'.\n";

    echo "Migration completed.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
