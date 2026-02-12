<?php

namespace App\Helpers;

use App\Config\Env;
use Exception;

class EmailHelper {
    private $host;
    private $port;
    private $username;
    private $password;
    private $from;
    private $fromName;
    private $driver;

    public function __construct() {
        $this->driver = Env::get('MAIL_DRIVER', 'log'); // default to log
        
        $this->host = Env::get('SMTP_HOST');
        $this->port = Env::get('SMTP_PORT', 587);
        $this->username = Env::get('SMTP_USER');
        $this->password = Env::get('SMTP_PASS');
        // Specific requirement: recruitment@multipriority.com
        $this->from = Env::get('SMTP_FROM', 'recruitment@multipriority.com');
        $this->fromName = Env::get('SMTP_NAME', 'MPB Karir Recruitment');
    }

    public static function send($to, $subject, $body, $from = null, $fromName = null) {
        $mailer = new self();
        if ($from) $mailer->from = $from;
        if ($fromName) $mailer->fromName = $fromName;
        return $mailer->sendEmail($to, $subject, $body);
    }

    private function sendEmail($to, $subject, $body) {
        try {
            switch ($this->driver) {
                case 'mail':
                    return $this->sendViaMail($to, $subject, $body);
                case 'smtp':
                    return $this->sendViaSmtp($to, $subject, $body);
                case 'log':
                default:
                    return $this->sendViaLog($to, $subject, $body);
            }
        } catch (Exception $e) {
            error_log("Email Error ({$this->driver}): " . $e->getMessage());
            // Fallback to log if not already logging
            if ($this->driver !== 'log') {
                $this->sendViaLog($to, $subject, $body, "FAILED (" . $e->getMessage() . ")");
            }
            return false;
        }
    }

    private function sendViaLog($to, $subject, $body, $prefix = "") {
        $logMessage = "[" . date('Y-m-d H:i:s') . "] {$prefix} EMAIL TO {$to}\nSUBJECT: {$subject}\nBODY:\n{$body}\n" . str_repeat("-", 50) . "\n";
        file_put_contents(__DIR__ . "/../../storage/logs/email.log", $logMessage, FILE_APPEND);
        return true;
    }

    private function sendViaMail($to, $subject, $body) {
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=utf-8\r\n";
        // Ensure From header is properly formatted
        $headers .= "From: " . $this->fromName . " <" . $this->from . ">\r\n";
        $headers .= "Reply-To: " . $this->from . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $headers .= "X-Priority: 1\r\n"; // High priority

        // Use the -f parameter to set the envelope sender, which is often required by hosting providers
        $params = "-f" . $this->from;

        if (mail($to, $subject, $body, $headers, $params)) {
            return true;
        } else {
            // Log the failure but don't expose system details
            error_log("PHP mail() failed for: $to");
            throw new Exception("PHP mail() function failed");
        }
    }

    private function sendViaSmtp($to, $subject, $body) {
        if (empty($this->host) || empty($this->username)) {
            throw new Exception("SMTP credentials missing");
        }

        $socket = fsockopen(($this->port == 465 ? "ssl://" : "") . $this->host, $this->port, $errno, $errstr, 10);
        if (!$socket) {
            throw new Exception("Could not connect to SMTP host: $errstr");
        }

        $this->serverCmd($socket, "220"); // Welcome
        $this->serverCmd($socket, "EHLO " . $this->host, "250"); // Hello

        if ($this->port == 587) {
            $this->serverCmd($socket, "STARTTLS", "220");
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            $this->serverCmd($socket, "EHLO " . $this->host, "250");
        }

        $this->serverCmd($socket, "AUTH LOGIN", "334");
        $this->serverCmd($socket, base64_encode($this->username), "334");
        $this->serverCmd($socket, base64_encode($this->password), "235");

        $this->serverCmd($socket, "MAIL FROM: <" . $this->from . ">", "250");
        $this->serverCmd($socket, "RCPT TO: <" . $to . ">", "250");
        $this->serverCmd($socket, "DATA", "354");

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=utf-8\r\n";
        $headers .= "From: " . $this->fromName . " <" . $this->from . ">\r\n";
        $headers .= "To: <" . $to . ">\r\n";
        $headers .= "Subject: " . $subject . "\r\n";

        fwrite($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        $this->getServerResponse($socket, "250");

        $this->serverCmd($socket, "QUIT", "221");
        fclose($socket);

        return true;
    }

    private function serverCmd($socket, $cmd, $expect) {
        fwrite($socket, $cmd . "\r\n");
        return $this->getServerResponse($socket, $expect);
    }

    private function getServerResponse($socket, $expect) {
        $response = "";
        while (substr($response, 3, 1) != ' ') {
            if (!($line = fgets($socket, 515))) {
                throw new Exception("Unexpected end of stream");
            }
            $response = $line;
        }
        if (substr($response, 0, 3) != $expect) {
            throw new Exception("SMTP Error: Expected $expect, got $response");
        }
        return $response;
    }
}
