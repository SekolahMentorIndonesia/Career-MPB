<?php
require_once __DIR__ . '/app/Config/Env.php';
require_once __DIR__ . '/app/Config/Database.php';

use App\Config\Database;
use App\Config\Env;

// Load environment variables
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . '=' . trim($value));
    }
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $tables = [];
    $stmt = $db->query('SHOW TABLES');
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $tables[] = $row[0];
    }

    // Define correct dependency order
    $priority = [
        'users' => 1,
        'jobs' => 2,
        'psychotests' => 3,
        'psychotest_questions' => 4,
        'psychotest_settings' => 5,
        'notifications' => 6,
        'applications' => 7,
        'user_documents' => 8,
        'psychotest_answers' => 9
    ];

    usort($tables, function($a, $b) use ($priority) {
        $pA = $priority[$a] ?? 99;
        $pB = $priority[$b] ?? 99;
        return $pA - $pB;
    });
    
    $sql = "-- Database Dump for Hostinger (Fixed Foreign Keys)\n";
    $sql .= "-- Generated on " . date('Y-m-d H:i:s') . "\n";
    $sql .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
    $sql .= "SET time_zone = \"+00:00\";\n";
    $sql .= "SET FOREIGN_KEY_CHECKS = 0;\n\n";
    
    foreach ($tables as $table) {
        $sql .= "-- Table structure for table `$table` --\n";
        $sql .= "DROP TABLE IF EXISTS `$table`;\n";
        $row = $db->query('SHOW CREATE TABLE ' . $table)->fetch(PDO::FETCH_NUM);
        $sql .= $row[1] . ";\n\n";
        
        $sql .= "-- Dumping data for table `$table` --\n";
        $result = $db->query('SELECT * FROM ' . $table);
        $numFields = $result->columnCount();
        
        $sql .= "INSERT INTO `$table` VALUES \n";
        
        $rowCount = 0;
        while ($row = $result->fetch(PDO::FETCH_NUM)) {
            if ($rowCount > 0) $sql .= ",\n";
            $sql .= "(";
            for ($j = 0; $j < $numFields; $j++) {
                $val = $row[$j];
                if (isset($val)) {
                    $val = addslashes((string)$val);
                    $val = str_replace("\n", "\\n", $val);
                    $sql .= '"' . $val . '"';
                } else {
                    $sql .= 'NULL';
                }
                if ($j < ($numFields - 1)) {
                    $sql .= ',';
                }
            }
            $sql .= ")";
            $rowCount++;
        }
        
        if ($rowCount > 0) {
            $sql .= ";\n\n";
        } else {
            $sql = substr($sql, 0, -25); 
            $sql .= "\n-- No data for table `$table` --\n\n";
        }
    }
    
    $sql .= "SET FOREIGN_KEY_CHECKS = 1;\n";
    
    file_put_contents(__DIR__ . '/karir_production.sql', $sql);
    echo "Successfully exported database with FK checks disabled to backend/karir_production.sql";

} catch (Exception $e) {
    echo "Error exporting database: " . $e->getMessage();
}
