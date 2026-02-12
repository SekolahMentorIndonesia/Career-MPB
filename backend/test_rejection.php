<?php
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/env.php';

use App\Config\Database;
use App\Config\Env;

Env::load(__DIR__ . '/.env');

try {
    $db = (new Database())->getConnection();
    
    // 1. Reset application 2 to 'Psikotes'
    echo "Resetting app 2 to 'Psikotes'...\n";
    $db->prepare("UPDATE applications SET status = 'Psikotes', last_status = NULL, rejected_at = NULL WHERE id = 2")->execute();
    
    // 2. Simulate rejection logic from ApplicationController
    echo "Simulating rejection...\n";
    $application_id = 2;
    $new_status = 'Ditolak';
    
    // Get current status
    $getCurrQuery = "SELECT status FROM applications WHERE id = :id";
    $getCurrStmt = $db->prepare($getCurrQuery);
    $getCurrStmt->execute([':id' => $application_id]);
    $currentStatus = $getCurrStmt->fetchColumn();
    echo "Current status was: $currentStatus\n";

    $extraSet = "";
    $params = [':status' => $new_status, ':id' => $application_id];
    
    if ($new_status === 'Ditolak' || $new_status === 'Diterima') {
        $extraSet = ", last_status = :last_status, rejected_at = NOW()";
        $params[':last_status'] = $currentStatus;
    }

    $query = "UPDATE applications SET status = :status $extraSet WHERE id = :id";
    echo "Running query: $query\n";
    $stmt = $db->prepare($query);
    $res = $stmt->execute($params);
    
    if ($res) {
        $check = $db->query("SELECT status, last_status, rejected_at FROM applications WHERE id = 2")->fetch(PDO::FETCH_ASSOC);
        echo "RESULT AFTER REJECTION:\n";
        print_r($check);
    } else {
        echo "Update failed!\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
