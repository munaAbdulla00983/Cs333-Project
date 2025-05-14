<?php
// Database configuration
class Database {
    private $host = "sql5.freesqldatabase.com";
    private $database_name = "sql5778139";
    private $username = "sql5778139";
    private $password = "iq22qF9rAk";
    public $conn;

    // Get database connection
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo json_encode(array(
                "status" => "error",
                "message" => "Connection error: " . $exception->getMessage()
            ));
            die();
        }

        return $this->conn;
    }
}
?>