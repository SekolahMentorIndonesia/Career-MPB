<?php
header('Content-Type: text/plain');
echo "--- ALL HEADERS ---\n";
print_r(getallheaders());

echo "\n--- RELEVANT SERVER VARS ---\n";
$relevant = [
    'HTTP_AUTHORIZATION',
    'REDIRECT_HTTP_AUTHORIZATION',
    'HTTP_X_AUTHORIZATION',
    'REDIRECT_HTTP_X_AUTHORIZATION',
    'REQUEST_METHOD',
    'REQUEST_URI'
];

foreach ($relevant as $key) {
    echo "$key: " . ($_SERVER[$key] ?? 'N/A') . "\n";
}

echo "\n--- ALL SERVER VARS (FILTERED) ---\n";
foreach ($_SERVER as $key => $value) {
    if (strpos($key, 'AUTH') !== false || strpos($key, 'HTTP') !== false) {
        echo "$key: $value\n";
    }
}
?>
