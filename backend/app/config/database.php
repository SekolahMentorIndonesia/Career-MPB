<?php

namespace App\Config;

use PDO;
use PDOException;

class Database {
    private $host = "127.0.0.1";
    private $db_name = "karir_db";
    private $username = "root";
    private $password = ""; // Default XAMPP password
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            return null;
        }

        return $this->conn;
    }
}
