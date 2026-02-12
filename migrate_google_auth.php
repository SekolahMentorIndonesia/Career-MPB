<?php
/**
 * Migration: Add Google OAuth support to users table
 * Run this script once to update existing database
 */

require_once __DIR__ . '/backend/app/Config/Env.php';

use App\Config\Env;

// Load environment
Env::load(__DIR__ . '/backend/.env');

// Database connection
$host = Env::get('DB_HOST');
$dbname = Env::get('DB_NAME');
$username = Env::get('DB_USER');
$password = Env::get('DB_PASS');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to database successfully.\n\n";
    
    // Check if columns already exist
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $changes = [];
    
    // Add provider column if not exists
    if (!in_array('provider', $columns)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN provider VARCHAR(20) DEFAULT 'local' AFTER password");
        $changes[] = "✓ Added 'provider' column";
        echo "✓ Added 'provider' column\n";
    } else {
        echo "- 'provider' column already exists\n";
    }
    
    // Add google_id column if not exists
    if (!in_array('google_id', $columns)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) DEFAULT NULL AFTER provider");
        $changes[] = "✓ Added 'google_id' column";
        echo "✓ Added 'google_id' column\n";
    } else {
        echo "- 'google_id' column already exists\n";
    }
    
    // Modify password to allow NULL (for Google users)
    $pdo->exec("ALTER TABLE users MODIFY COLUMN password VARCHAR(255) DEFAULT NULL");
    $changes[] = "✓ Modified 'password' column to allow NULL";
    echo "✓ Modified 'password' column to allow NULL\n";
    
    // Verify email_verified_at exists (should already be there)
    if (!in_array('email_verified_at', $columns)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN email_verified_at DATETIME DEFAULT NULL AFTER skills");
        $changes[] = "✓ Added 'email_verified_at' column";
        echo "✓ Added 'email_verified_at' column\n";
    } else {
        echo "- 'email_verified_at' column already exists\n";
    }
    
    echo "\n";
    echo "========================================\n";
    echo "Migration completed successfully!\n";
    echo "========================================\n";
    
    if (count($changes) > 0) {
        echo "\nChanges made:\n";
        foreach ($changes as $change) {
            echo "  $change\n";
        }
    } else {
        echo "\nNo changes needed - database already up to date.\n";
    }
    
    // Show updated schema
    echo "\n";
    echo "Updated users table structure:\n";
    echo "----------------------------------------\n";
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        $null = $column['Null'] === 'YES' ? 'NULL' : 'NOT NULL';
        $default = $column['Default'] !== null ? "DEFAULT '{$column['Default']}'" : '';
        echo sprintf("%-25s %-20s %-10s %s\n", 
            $column['Field'], 
            $column['Type'], 
            $null,
            $default
        );
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
