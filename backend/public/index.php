<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Basic Autoloader for Native PHP
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

use App\Middleware\CorsMiddleware;

// Handle CORS
CorsMiddleware::handle();

// Include Routes
require_once __DIR__ . '/../app/routes.php';
