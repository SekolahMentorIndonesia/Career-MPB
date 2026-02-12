<?php
require_once __DIR__ . '/app/Config/Env.php';
require_once __DIR__ . '/app/Config/Database.php';

use App\Config\Database;

try {
    $db = (new Database())->getConnection();
    
    echo "Migrating user photo paths...\n";
    
    // 1. Update users table - REPLACE /storage/uploads/ with /uploads/
    $query1 = "UPDATE users SET photo = REPLACE(photo, '/storage/uploads/', '/uploads/') WHERE photo LIKE '/storage/uploads/%'";
    $stmt1 = $db->prepare($query1);
    $stmt1->execute();
    echo "Updated " . $stmt1->rowCount() . " rows in users table.\n";
    
    // 2. Update user_documents table
    $docFields = ['cv_url', 'photo_url', 'portfolio_url', 'ktp_url', 'other_url', 'paklaring_url'];
    foreach ($docFields as $field) {
        $query = "UPDATE user_documents SET $field = REPLACE($field, '/storage/uploads/', '/uploads/') WHERE $field LIKE '/storage/uploads/%'";
        $stmt = $db->prepare($query);
        $stmt->execute();
        echo "Updated " . $stmt->rowCount() . " rows for $field in user_documents table.\n";
    }
    
    echo "Migration completed successfully.\n";
    
} catch (\Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
