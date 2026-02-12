<?php
// FILE: backend/public/create_application_stages.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<pre>";
echo "--- DEBUGGING PATHS ---\n";

$currentFile = __FILE__;
$currentDir = __DIR__;
echo "Script location: $currentFile\n";
echo "Current directory: $currentDir\n";

// Function to find file recursively (limited depth)
function findFile($filename, $searchPath, $maxDepth = 3) {
    if ($maxDepth < 0) return null;
    
    $it = new RecursiveDirectoryIterator($searchPath, RecursiveDirectoryIterator::SKIP_DOTS);
    $ri = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::SELF_FIRST);
    $ri->setMaxDepth($maxDepth);

    foreach ($ri as $file) {
        if ($file->getFilename() === $filename) {
            return $file->getPathname();
        }
    }
    return null;
}

// Try standard paths
$searchRoot = dirname(__DIR__); // Should be 'backend'
echo "Searching from root: $searchRoot\n";

$envPath = findFile('Env.php', $searchRoot);
$dbPath = findFile('Database.php', $searchRoot);

if (!$envPath) {
    echo "WARNING: Env.php not found automatically. Trying manual fallback...\n";
    // Check common locations
    $fbPaths = [
        $searchRoot . '/app/Config/Env.php',
        $searchRoot . '/app/config/Env.php',
        $searchRoot . '/app/config/env.php',
        dirname($searchRoot) . '/app/Config/Env.php'
    ];
    foreach ($fbPaths as $p) {
        if (file_exists($p)) { $envPath = $p; break; }
    }
}

if (!$dbPath) {
    echo "WARNING: Database.php not found automatically. Trying manual fallback...\n";
    $fbPaths = [
        $searchRoot . '/app/Config/Database.php',
        $searchRoot . '/app/config/Database.php',
        dirname($searchRoot) . '/app/Config/Database.php'
    ];
    foreach ($fbPaths as $p) {
        if (file_exists($p)) { $dbPath = $p; break; }
    }
}

if (!$envPath || !$dbPath) {
    echo "\nCRITICAL ERROR: Core files not found!\n";
    echo "Directory listing for $searchRoot:\n";
    try {
        $files = scandir($searchRoot);
        print_r($files);
    } catch (Exception $e) { echo "Cannot list $searchRoot\n"; }
    die();
}

echo "Detected Env: $envPath\n";
echo "Detected DB: $dbPath\n";

require_once $envPath;
require_once $dbPath;

use App\Config\Env;
use App\Config\Database;

try {
    // Load Environment
    $envFile = dirname($searchRoot) . '/.env'; 
    if (!file_exists($envFile)) {
        $envFile = $searchRoot . '/.env'; 
    }
    
    if (!file_exists($envFile)) {
        throw new Exception(".env file not found anywhere near $searchRoot");
    }
    
    Env::load($envFile);
    echo "Environment loaded: $envFile\n";

    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) throw new Exception("Database connection failed.");
    echo "Database connected.\n\n";

    // Migration Logic
    $db->exec("CREATE TABLE IF NOT EXISTS application_stages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        stage_name VARCHAR(100) NOT NULL,
        status ENUM('pending', 'passed', 'rejected', 'locked') DEFAULT 'pending',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_app_stage (application_id, stage_name),
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    
    echo "Table verified.\n";

    $apps = $db->query("SELECT id, status FROM applications")->fetchAll(PDO::FETCH_ASSOC);
    $stageStmt = $db->prepare("INSERT IGNORE INTO application_stages (application_id, stage_name, status) VALUES (?, ?, ?)");
    $stages = ['Administrasi', 'Psikotes', 'Interview', 'Final'];

    foreach ($apps as $app) {
        $appId = $app['id'];
        $status = strtoupper(trim($app['status']));
        $targetStage = 'Administrasi';
        $isRejected = ($status === 'DITOLAK');
        $isAccepted = ($status === 'DITERIMA');

        if (in_array($status, ['ADMINISTRASI', 'SELEKSI ADMINISTRASI', 'DIKIRIM'])) $targetStage = 'Administrasi';
        elseif (in_array($status, ['PSIKOTES', 'TES PSIKOTES'])) $targetStage = 'Psikotes';
        elseif ($status === 'INTERVIEW') $targetStage = 'Interview';
        elseif ($status === 'FINAL' || $isAccepted) $targetStage = 'Final';

        $targetIndex = array_search($targetStage, $stages);

        foreach ($stages as $index => $stageName) {
            $stageStatus = 'pending';
            if ($index < $targetIndex) $stageStatus = 'passed';
            elseif ($index === $targetIndex) {
                if ($isRejected) $stageStatus = 'rejected';
                elseif ($isAccepted && $stageName === 'Final') $stageStatus = 'passed';
                else $stageStatus = 'pending';
            } else $stageStatus = ($isRejected) ? 'locked' : 'pending';

            $stageStmt->execute([$appId, $stageName, $stageStatus]);
        }
    }

    echo "\n--- SUCCESS! Migration completed ---\n";
    echo "Silakan cek dashboard pelamar Anda.\n";
    echo "\nPERINGATAN: Hapus file ini jika sudah selesai.\n";
    echo "</pre>";

} catch (Exception $e) {
    echo "\n[ERROR]: " . $e->getMessage() . "\n";
    echo "</pre>";
}
