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
        $this->fromName = Env::get('SMTP_NAME', 'Recruitment - MPB Group');
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

        error_log("Attempting SMTP connection to {$this->host}:{$this->port}");
        $socket = fsockopen(($this->port == 465 ? "ssl://" : "") . $this->host, $this->port, $errno, $errstr, 30);
        if (!$socket) {
            error_log("SMTP Connection Failed: $errstr ($errno)");
            throw new Exception("Could not connect to SMTP host: $errstr");
        }

        $this->serverCmd($socket, null, "220"); // Welcome (null means just read)
        $this->serverCmd($socket, "EHLO " . $this->host, "250"); // Hello

        if ($this->port == 587) {
            $this->serverCmd($socket, "STARTTLS", "220");
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new Exception("Failed to enable crypto for STARTTLS");
            }
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
        $headers .= "Date: " . date('r') . "\r\n";
        $headers .= "Message-ID: <" . time() . "-" . md5($to) . "@" . $this->host . ">\r\n";

        fwrite($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        $this->getServerResponse($socket, "250");

        $this->serverCmd($socket, "QUIT", "221");
        fclose($socket);

        error_log("SMTP: Success sending email to $to");
        return true;
    }

    private function serverCmd($socket, $cmd, $expect) {
        if ($cmd !== null) {
            fwrite($socket, $cmd . "\r\n");
            // Don't log passwords
            $logCmd = (strpos($cmd, 'AUTH') === false && strlen($cmd) < 50) ? $cmd : "[HIDDEN COMMAND]";
            error_log("SMTP Send: $logCmd");
        }
        return $this->getServerResponse($socket, $expect);
    }

    private function getServerResponse($socket, $expect) {
        $response = "";
        while (substr($response, 3, 1) != ' ') {
            if (!($line = fgets($socket, 515))) {
                error_log("SMTP Error: Unexpected end of stream while waiting for $expect");
                throw new Exception("Unexpected end of stream");
            }
            $response = $line;
            error_log("SMTP Recv: " . trim($response));
        }
        if (substr($response, 0, 3) != $expect) {
            error_log("SMTP Error: Expected $expect, got $response");
            throw new Exception("SMTP Error: Expected $expect, got $response");
        }
        return $response;
    }
}
