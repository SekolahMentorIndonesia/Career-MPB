<?php
require_once __DIR__ . '/backend/app/Config/Env.php';
require_once __DIR__ . '/backend/app/Config/Database.php';

use App\Config\Database;

$database = new Database();
$db = $database->getConnection();

try {
    echo "--- CREATING TABLE: application_stages ---\n";
    $sql = "CREATE TABLE IF NOT EXISTS application_stages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        stage_name VARCHAR(100) NOT NULL,
        status ENUM('pending', 'passed', 'rejected', 'locked') DEFAULT 'pending',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_app_stage (application_id, stage_name),
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    $db->exec($sql);
    echo "Table created/verified successfully.\n";

    echo "--- INITIALIZING STAGES FOR EXISTING APPLICATIONS ---\n";
    $appsStmt = $db->query("SELECT id, status FROM applications");
    $apps = $appsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    $stages = ['Administrasi', 'Psikotes', 'Interview', 'Final'];
    $stageStmt = $db->prepare("INSERT IGNORE INTO application_stages (application_id, stage_name, status) VALUES (?, ?, ?)");

    foreach ($apps as $app) {
        $appId = $app['id'];
        $status = $app['status'];
        
        // Define what "passed" means based on current status
        $targetStage = 'Administrasi';
        $isRejected = ($status === 'Ditolak');
        $isAccepted = ($status === 'Diterima');

        if (in_array($status, ['Administrasi', 'Seleksi Administrasi', 'Dikirim'])) {
            $targetStage = 'Administrasi';
        } elseif (in_array($status, ['Psikotes', 'Tes Psikotes'])) {
            $targetStage = 'Psikotes';
        } elseif ($status === 'Interview') {
            $targetStage = 'Interview';
        } elseif ($status === 'Final' || $isAccepted) {
            $targetStage = 'Final';
        }

        $targetIndex = array_search($targetStage, $stages);

        foreach ($stages as $index => $stageName) {
            $stageStatus = 'pending';
            
            if ($index < $targetIndex) {
                $stageStatus = 'passed';
            } elseif ($index === $targetIndex) {
                if ($isRejected) $stageStatus = 'rejected';
                elseif ($isAccepted && $stageName === 'Final') $stageStatus = 'passed';
                else $stageStatus = 'pending'; // Active stage
            } else {
                $stageStatus = ($isRejected) ? 'locked' : 'pending';
            }

            $stageStmt->execute([$appId, $stageName, $stageStatus]);
        }
        echo "Initialized stages for application #$appId (Status: $status)\n";
    }

    echo "Migration completed successfully.\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
