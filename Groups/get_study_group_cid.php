<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'connection.php';

$database = new Database();
$conn = $database->getConnection();
 $data = json_decode(file_get_contents("php://input"), true);
// Validate input
  $requiredFields = ['Ccode'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["message" => "$field is required."]);
        exit();
    }
}

try {
    $query = "SELECT * FROM study_group where Ccode = '".$data['Ccode']."'";
    $stmt = $conn->prepare($query);

    $stmt->execute();

    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($groups);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching data", "error" => $e->getMessage()]);
}
