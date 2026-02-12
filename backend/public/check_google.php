<?php
// Script untuk mengecek konfigurasi Google Login di server produksi
header('Content-Type: text/plain');

echo "--- CHECK GOOGLE CONFIG ---\n\n";

// 1. Cek .env
$envPath = __DIR__ . '/../.env';
echo "Checking .env at: $envPath\n";
if (file_exists($envPath)) {
    echo "SUCCESS: .env found.\n";
    $content = file_get_contents($envPath);
    if (strpos($content, 'GOOGLE_CLIENT_ID') !== false) {
        echo "SUCCESS: GOOGLE_CLIENT_ID found in .env.\n";
    } else {
        echo "ERROR: GOOGLE_CLIENT_ID MISSING in .env.\n";
    }
} else {
    echo "ERROR: .env NOT FOUND.\n";
}

// 2. Cek cURL extension
echo "\nChecking cURL extension:\n";
if (function_exists('curl_init')) {
    echo "SUCCESS: cURL extension is enabled.\n";
    
    // Test hit Google Token Info
    $ch = curl_init("https://oauth2.googleapis.com/tokeninfo");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode > 0) {
        echo "SUCCESS: Server can connect to Google API (HTTP $httpCode).\n";
    } else {
        echo "ERROR: Server CANNOT connect to Google API. Check firewall/outgoing connection.\n";
    }
} else {
    echo "ERROR: cURL extension is MISSING. Please enable it in PHP settings on Hostinger.\n";
}

// 3. Cek OpenSSL
echo "\nChecking OpenSSL extension:\n";
if (extension_loaded('openssl')) {
    echo "SUCCESS: OpenSSL is enabled.\n";
} else {
    echo "ERROR: OpenSSL is MISSING.\n";
}

echo "\n--- CHECK COMPLETE ---";
