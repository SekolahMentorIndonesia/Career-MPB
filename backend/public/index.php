<?php
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

use App\Config\Env;
use App\Middleware\CorsMiddleware;

// Load Environment Variables
Env::load(__DIR__ . '/../.env');

// Set Timezone
date_default_timezone_set(Env::get('APP_TIMEZONE', 'Asia/Jakarta'));

// Set Error Reporting based on environment
$debug = Env::get('APP_DEBUG', 'false') === 'true';
if ($debug) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Handle CORS
CorsMiddleware::handle();

// Include Routes
require_once __DIR__ . '/../app/routes.php';
