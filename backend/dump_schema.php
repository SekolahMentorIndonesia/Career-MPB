<?php
require_once __DIR__ . '/app/config/database.php';

use App\Config\Database;

try {
    $db = (new Database())->getConnection();
    
    echo "--- APPLICATIONS Table ---\n";
    try {
        $stmt = $db->query("DESCRIBE applications");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $col) {
            echo $col['Field'] . " | " . $col['Type'] . "\n";
        }
    } catch (PDOException $e) {
        echo "Error describing applications: " . $e->getMessage() . "\n";
    }

    echo "\n--- PSYCHOTESTS Table ---\n";
    try {
        $stmt = $db->query("DESCRIBE psychotests");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $col) {
            echo $col['Field'] . " | " . $col['Type'] . "\n";
        }
    } catch (PDOException $e) {
         echo "Error describing psychotests: " . $e->getMessage() . "\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
