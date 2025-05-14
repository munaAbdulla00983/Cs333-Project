<?php
// Enable CORS if needed
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
class Database {
    private $host = "127.0.0.1";
    private $db_name = "mydb";
    private $username = "user1";
    private $password = "1234Muna";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name}",
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
        } catch(PDOException $e) {
            echo json_encode(["message" => "Connection failed", "error" => $e->getMessage()]);
            exit();
        }
        return $this->conn;
    }
}