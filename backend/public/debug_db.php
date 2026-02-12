<?php
// Force error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h3>🔍 Debugging Database Connection</h3>";

// 1. Check .env file
$envPath = __DIR__ . '/../.env';
echo "Checking .env path: " . $envPath . "<br>";

if (!file_exists($envPath)) {
    die("<h1 style='color:red'>❌ Error: .env file NOT FOUND!</h1><p>Please make sure you renamed .env.example to .env inside the 'backend' folder.</p>");
} else {
    echo "✅ .env file found.<br>";
}

// 2. Parse .env manually to verify permissions/content
$lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$env = [];
foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    list($name, $value) = explode('=', $line, 2);
    $env[trim($name)] = trim($value);
}

// Debug output credentials (masked password)
$dbHost = $env['DB_HOST'] ?? 'NOT_SET';
$dbName = $env['DB_NAME'] ?? 'NOT_SET';
$dbUser = $env['DB_USER'] ?? 'NOT_SET';
$dbPass = $env['DB_PASS'] ?? '';
$maskedPass = substr($dbPass, 0, 3) . '****';

echo "<ul>";
echo "<li><strong>DB_HOST:</strong> $dbHost</li>";
echo "<li><strong>DB_NAME:</strong> $dbName</li>";
echo "<li><strong>DB_USER:</strong> $dbUser</li>";
echo "<li><strong>DB_PASS:</strong> $maskedPass</li>";
echo "</ul>";

// 3. Try Connecting
try {
    echo "Attempting PDO Connection...<br>";
    $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<h1 style='color:green'>✅ SUCCESS! Database Connected.</h1>";
} catch (PDOException $e) {
    echo "<h1 style='color:red'>❌ Database Connection FAILED</h1>";
    echo "<pre>" . $e->getMessage() . "</pre>";
    echo "<p>Please check your DB_USER ($dbUser) and DB_PASS in .env file again.</p>";
}
