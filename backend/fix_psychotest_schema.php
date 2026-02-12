<?php
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/env.php';

use App\Config\Database;
use App\Config\Env;

// Standalone execution: load .env
Env::load(__DIR__ . '/.env');

try {
    $db = (new Database())->getConnection();
    if (!$db) {
        die("Connection failed\n");
    }

    echo "Fixing psychotests table schema...\n";

    // 1. Remove the JSON check constraint by modifying the column to plain LONGTEXT
    // This is the most compatible way to ensure any string works.
    $sql = "ALTER TABLE psychotests MODIFY COLUMN results LONGTEXT DEFAULT NULL";
    $db->exec($sql);
    echo "Column 'results' converted to plain LONGTEXT (CHECK constraint removed).\n";

    // 2. Ensure score column exists for real values
    $sqlScore = "ALTER TABLE psychotests MODIFY COLUMN score INT DEFAULT NULL";
    $db->exec($sqlScore);
    echo "Column 'score' verified.\n";

    echo "Database fix completed successfully.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
