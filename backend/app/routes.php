<?php

use App\Controllers\AuthController;
use App\Controllers\GoogleAuthController;
use App\Controllers\UserController;
use App\Controllers\AdminController;
use App\Controllers\JobController;
use App\Controllers\ApplicationController;
use App\Controllers\NotificationController;
use App\Controllers\PsychotestController;
use App\Controllers\HealthController;
use App\Helpers\ResponseHelper;

$auth = new AuthController();
$googleAuth = new GoogleAuthController();
$user = new UserController();
$admin = new AdminController();
$job = new JobController();
$app = new ApplicationController();
$notif = new NotificationController();
$psychotest = new PsychotestController();
$health = new HealthController();

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// More robust path calculation for various hosting environments
$path = $requestUri;

// Strip SCRIPT_NAME prefix if present (e.g. /backend/public/index.php/api/...)
$scriptName = $_SERVER['SCRIPT_NAME'];
$scriptDir = dirname($scriptName);

if ($scriptDir !== '/' && $scriptDir !== '\\' && strpos($path, $scriptDir) === 0) {
    $path = substr($path, strlen($scriptDir));
}

// Ensure path starts with /
if (empty($path) || $path[0] !== '/') {
    $path = '/' . $path;
}

// Explicitly strip common prefixes that might linger due to .htaccess or various configs
$prefixesToRemove = ['/index.php', '/public', '/backend'];
foreach ($prefixesToRemove as $prefix) {
    if (strpos($path, $prefix) === 0) {
        $path = substr($path, strlen($prefix));
    }
}

// Final check: ensure path starts with / and isn't empty
if (empty($path) || $path[0] !== '/') {
    $path = '/' . $path;
}

// Simple hardcoded router
switch ($path) {
    case '/api/auth/register':
        if ($method == 'POST') $auth->register();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/health':
        if ($method == 'GET') $health->check();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/auth/verify-email':
        if ($method == 'POST') $auth->verifyEmail();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/auth/login':
        if ($method == 'POST') $auth->login();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/auth/google':
        if ($method == 'POST') $googleAuth->googleLogin();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    
    case '/api/user/profile':
        if ($method == 'GET') $user->getProfile();
        elseif ($method == 'PUT') $user->updateProfile();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/user/upload-photo':
        if ($method == 'POST') $user->uploadPhoto();
        elseif ($method == 'DELETE') $user->deletePhoto();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/user/request-phone-otp':
        if ($method == 'POST') $user->requestPhoneOtp();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/user/verify-phone':
        if ($method == 'POST') $user->verifyPhone();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/user/change-password':
        if ($method == 'POST') $user->changePassword();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/user/dashboard-summary':
        if ($method == 'GET') $user->getDashboardSummary();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/user/documents':
        if ($method == 'GET') $user->getDocuments();
        elseif ($method == 'POST') $user->uploadDocuments();
        else ResponseHelper::error("Method not allowed", 405);
        break;

    case '/api/admin/users':
        if ($method == 'GET') $admin->getAllUsers();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/admin/export-users':
        if ($method == 'GET') $admin->exportUsers();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/admin/dashboard-stats':
        if ($method == 'GET') $admin->getDashboardStats();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/admin/notifications':
        if ($method == 'GET') $admin->getNotifications();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/admin/notifications/send':
        if ($method == 'POST') $admin->sendNotification();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/admin/notifications/hide':
        if ($method == 'POST') $admin->hideNotification();
        else ResponseHelper::error("Method not allowed", 405);
        break;

    case '/api/jobs':
        if ($method == 'GET') $job->index();
        elseif ($method == 'POST') $job->create();
        else ResponseHelper::error("Method not allowed", 405);
        break;

    case '/api/applications':
        if ($method == 'GET') $app->index();
        elseif ($method == 'POST') $app->apply();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/user/applications':
        if ($method == 'GET') $app->myApplications();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/applications/update-status':
        if ($method == 'POST') $app->updateStatus();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/applications/generate-link':
        if ($method == 'POST') $app->generateLink();
        else ResponseHelper::error("Method not allowed", 405);
        break;

    case '/api/notifications/send':
        if ($method == 'POST') $notif->send();
        else ResponseHelper::error("Method not allowed", 405);
        break;

    case '/api/notifications':
        if ($method == 'GET') $notif->index();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/notifications/mark-read':
        if ($method == 'POST') $notif->markRead();
        else ResponseHelper::error("Method not allowed", 405);
        break;

    case '/api/admin/psychotest/questions':
        if ($method == 'GET') $psychotest->getQuestions();
        elseif ($method == 'POST') $psychotest->createQuestion();
        elseif ($method == 'DELETE') $psychotest->deleteQuestion();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/admin/psychotest/settings':
        if ($method == 'GET') $psychotest->getSettings();
        elseif ($method == 'POST') $psychotest->updateSettings();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/admin/psychotest/summary':
        if ($method == 'GET') $psychotest->getSummary();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    
    case '/api/psychotest/test':
        if ($method == 'GET') $psychotest->getTest();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/psychotest/submit':
        if ($method == 'POST') $psychotest->submitTest();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/psychotest/preview':
        if ($method == 'GET') $psychotest->getPreviewTest();
        else ResponseHelper::error("Method not allowed", 405);
        break;

    default:
        // Check for parameterized routes
        if (preg_match('/^\/api\/jobs\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method == 'GET') $job->show($id);
            elseif ($method == 'PUT') $job->update($id);
            elseif ($method == 'DELETE') $job->delete($id);
            else ResponseHelper::error("Method not allowed", 405);
        } elseif (preg_match('/^\/api\/applications\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method == 'GET') $app->show($id);
            else ResponseHelper::error("Method not allowed", 405);
        } elseif (preg_match('/^\/api\/notifications\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method == 'PUT') $notif->update($id);
            else ResponseHelper::error("Method not allowed", 405);
        } elseif (preg_match('/^\/api\/user\/notifications\/(\d+)$/', $path, $matches)) {
            // Delete route removed
            ResponseHelper::error("Method not allowed", 405);
        } elseif (preg_match('/^\/api\/admin\/notifications\/(\d+)\/all\/?$/', $path, $matches)) {
            // Delete for all route removed
            ResponseHelper::error("Method not allowed", 405);
        } elseif ($path == '/api/user/psychotest' && $method == 'GET') {
            $app->getUserPsychotest();
        } elseif ($path == '/api/debug-headers' && $method == 'GET') {
            ResponseHelper::success("Headers Debug", [
                'headers' => getallheaders(),
                'server' => [
                    'HTTP_AUTHORIZATION' => $_SERVER['HTTP_AUTHORIZATION'] ?? 'N/A',
                    'REDIRECT_HTTP_AUTHORIZATION' => $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? 'N/A',
                    'HTTP_X_AUTHORIZATION' => $_SERVER['HTTP_X_AUTHORIZATION'] ?? 'N/A',
                    'REDIRECT_HTTP_X_AUTHORIZATION' => $_SERVER['REDIRECT_HTTP_X_AUTHORIZATION'] ?? 'N/A'
                ]
            ]);
        } else {
            ResponseHelper::error("Route not found", 404);
        }
        break;
}
