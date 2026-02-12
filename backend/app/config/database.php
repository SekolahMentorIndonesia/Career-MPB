<?php

namespace App\Config;

use App\Config\Env;
use PDO;
use PDOException;

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host = Env::get('DB_HOST', '127.0.0.1');
        $this->db_name = Env::get('DB_NAME', 'karir_db');
        $this->username = Env::get('DB_USER', 'root');
        $this->password = Env::get('DB_PASS', '');
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            // In production, we might want to return a JSON error and exit if DB is down,
            // but for now let's just log it. Controllers check if $this->db is null?
            // Actually, usually controllers assume db is valid. 
            // If connection fails, $this->db is null.
            return null;
        }

        return $this->conn;
    }
}
