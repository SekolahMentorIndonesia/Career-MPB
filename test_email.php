<?php
// Fix paths - we are in root/test_email.php, backend is in root/backend
require_once __DIR__ . '/backend/app/config/Env.php';
require_once __DIR__ . '/backend/app/helpers/EmailHelper.php';

use App\Config\Env;
use App\Helpers\EmailHelper;

// Manually load env
Env::load(__DIR__ . '/backend/.env');

echo "MAIL_DRIVER is: " . Env::get('MAIL_DRIVER') . "\n";

echo "Testing EmailHelper log driver...\n";
// This should write to backend/storage/logs/email.log
// The EmailHelper uses __DIR__ . "/../../storage/logs/email.log" relative to itself.
// EmailHelper is in backend/app/helpers/
// So __DIR__ is backend/app/helpers
// ../../ is backend/
// storage/logs/email.log -> backend/storage/logs/email.log. Correct.

$result = EmailHelper::send('test@local.dev', 'Test Subject', 'Test Body Content ' . date('Y-m-d H:i:s'));

if ($result) {
    echo "SUCCESS: Email sent.\n";
} else {
    echo "FAILURE: EmailHelper returned false.\n";
}
