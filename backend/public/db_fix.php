<?php
// detect if we are in backend/public or root
if (file_exists(__DIR__ . '/../app/Config/Env.php')) {
    require_once __DIR__ . '/../app/Config/Env.php';
    require_once __DIR__ . '/../app/Config/Database.php';
} else {
    require_once __DIR__ . '/backend/app/Config/Env.php';
    require_once __DIR__ . '/backend/app/Config/Database.php';
}

use App\Config\Database;

$database = new Database();
$db = $database->getConnection();

header('Content-Type: text/html');
// Disable output buffering to see progress
if (ob_get_level()) ob_end_clean();
echo "<html><body style='font-family: sans-serif; padding: 20px;'>";
echo "<h1>Database Fix Tool (v2)</h1>";

try {
    echo "<p>Connecting to database...</p>";
    $database = new Database();
    $db = $database->getConnection();
    echo "<p style='color: green;'>✅ Connected successfully.</p>";

    $columnsToAdd = [
        'user_documents' => [
            'ijazah_url' => "ALTER TABLE user_documents ADD COLUMN ijazah_url VARCHAR(255) DEFAULT NULL AFTER ktp_url"
        ],
        'users' => [
            'nik' => "ALTER TABLE users ADD COLUMN nik VARCHAR(20) DEFAULT NULL",
            'religion' => "ALTER TABLE users ADD COLUMN religion VARCHAR(50) DEFAULT NULL",
            'height' => "ALTER TABLE users ADD COLUMN height VARCHAR(10) DEFAULT NULL",
            'weight' => "ALTER TABLE users ADD COLUMN weight VARCHAR(10) DEFAULT NULL",
            'birth_place' => "ALTER TABLE users ADD COLUMN birth_place VARCHAR(100) DEFAULT NULL",
            'birth_date' => "ALTER TABLE users ADD COLUMN birth_date DATE DEFAULT NULL",
            'ktp_address' => "ALTER TABLE users ADD COLUMN ktp_address TEXT DEFAULT NULL",
            'ktp_rt' => "ALTER TABLE users ADD COLUMN ktp_rt VARCHAR(5) DEFAULT NULL",
            'ktp_rw' => "ALTER TABLE users ADD COLUMN ktp_rw VARCHAR(5) DEFAULT NULL",
            'ktp_kelurahan' => "ALTER TABLE users ADD COLUMN ktp_kelurahan VARCHAR(100) DEFAULT NULL",
            'ktp_kecamatan' => "ALTER TABLE users ADD COLUMN ktp_kecamatan VARCHAR(100) DEFAULT NULL",
            'ktp_kabupaten' => "ALTER TABLE users ADD COLUMN ktp_kabupaten VARCHAR(100) DEFAULT NULL",
            'domicile_address' => "ALTER TABLE users ADD COLUMN domicile_address TEXT DEFAULT NULL",
            'domicile_rt' => "ALTER TABLE users ADD COLUMN domicile_rt VARCHAR(5) DEFAULT NULL",
            'domicile_rw' => "ALTER TABLE users ADD COLUMN domicile_rw VARCHAR(5) DEFAULT NULL",
            'domicile_kelurahan' => "ALTER TABLE users ADD COLUMN domicile_kelurahan VARCHAR(100) DEFAULT NULL",
            'domicile_kecamatan' => "ALTER TABLE users ADD COLUMN domicile_kecamatan VARCHAR(100) DEFAULT NULL",
            'domicile_kabupaten' => "ALTER TABLE users ADD COLUMN domicile_kabupaten VARCHAR(100) DEFAULT NULL",
            'last_education' => "ALTER TABLE users ADD COLUMN last_education VARCHAR(100) DEFAULT NULL",
            'major' => "ALTER TABLE users ADD COLUMN major VARCHAR(100) DEFAULT NULL",
            'gpa' => "ALTER TABLE users ADD COLUMN gpa VARCHAR(10) DEFAULT NULL",
            'skills' => "ALTER TABLE users ADD COLUMN skills TEXT DEFAULT NULL"
        ]
    ];

    foreach ($columnsToAdd as $table => $cols) {
        echo "<h3>Checking table: <code>$table</code></h3>";
        
        // Get existing columns
        $existingCols = [];
        try {
            $stmt = $db->query("DESCRIBE $table");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $existingCols[] = $row['Field'];
            }
        } catch (\Exception $e) {
            echo "<p style='color: red;'>⚠️ Failed to describe table $table: " . htmlspecialchars($e->getMessage()) . "</p>";
            continue;
        }

        foreach ($cols as $column => $sql) {
            echo "Processing <code>$column</code>... ";
            if (in_array($column, $existingCols)) {
                echo "<span style='color: blue;'>ℹ️ Already exists</span><br>";
            } else {
                try {
                    $db->exec($sql);
                    echo "<span style='color: green;'>✅ Success</span><br>";
                } catch (\Exception $e) {
                    echo "<span style='color: orange;'>⚠️ Error: " . htmlspecialchars($e->getMessage()) . "</span><br>";
                }
            }
            flush();
        }
    }

    echo "<h2 style='color: green;'>Migration Finished!</h2>";

} catch (\Exception $e) {
    echo "<p style='color: red;'>❌ ERROR: " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo "<hr>";
echo "<p><b>Next Step:</b> You can now delete this file (<code>db_fix.php</code>) from your server for security.</p>";
echo "<a href='/dashboard/user/documents'>Go to Documents Page</a>";
echo "</body></html>";
