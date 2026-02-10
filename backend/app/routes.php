<?php

use App\Controllers\AuthController;
use App\Controllers\UserController;
use App\Controllers\AdminController;
use App\Controllers\JobController;
use App\Controllers\ApplicationController;
use App\Controllers\NotificationController;
use App\Controllers\PsychotestController;
use App\Helpers\ResponseHelper;

$auth = new AuthController();
$user = new UserController();
$admin = new AdminController();
$job = new JobController();
$app = new ApplicationController();
$notif = new NotificationController();
$psychotest = new PsychotestController();

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName === '/' || $scriptName === '\\') {
    $path = $requestUri;
} else {
    $path = str_replace($scriptName, '', $requestUri);
}

// Ensure path starts with /
if (strpos($path, '/') !== 0) {
    $path = '/' . $path;
}

// Remove index.php from path if present (for URL like index.php/api/...)
$path = str_replace('/index.php', '', $path);

// Simple hardcoded router
switch ($path) {
    case '/api/auth/register':
        if ($method == 'POST') $auth->register();
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
    
    case '/api/user/profile':
        if ($method == 'GET') $user->getProfile();
        elseif ($method == 'PUT') $user->updateProfile();
        else ResponseHelper::error("Method not allowed", 405);
        break;
    case '/api/user/upload-photo':
        if ($method == 'POST') $user->uploadPhoto();
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
    case '/api/admin/notifications/send':
        if ($method == 'POST') $admin->sendNotification();
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
            // else ResponseHelper::error("Method not allowed", 405);
        } elseif ($path == '/api/user/psychotest' && $method == 'GET') {
            $app->getUserPsychotest();
        } else {
            ResponseHelper::error("Route not found", 404);
        }
        break;
}
