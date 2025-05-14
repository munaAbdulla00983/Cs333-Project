<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'connection.php';

$database = new Database();
$conn = $database->getConnection();

try {
    $query = "SELECT * FROM study_group";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($groups);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching data", "error" => $e->getMessage()]);
}
