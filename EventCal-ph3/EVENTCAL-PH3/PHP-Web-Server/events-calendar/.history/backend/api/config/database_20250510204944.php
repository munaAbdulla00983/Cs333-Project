<?php
// Database configuration
class Database {
    private $host = "localhost";
    private $database_name = "campus_hub";
    private $username = "root";
    private $password = "";
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