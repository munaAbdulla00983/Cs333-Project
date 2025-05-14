<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  // Include DB config
  require_once 'connection.php';

  // Initialize DB connection
  $database = new Database();
  $conn = $database->getConnection();

  // Read input
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
try{
    $query = "DELETE FROM study_group 
              WHERE Ccode = :Ccode";  // You must pass this ID from the client

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':Ccode', $data['Ccode']);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Study group delete successfully."]);
    } else {
        throw new Exception("Database update failed.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error inserting study group.", "error" => $e->getMessage()]);
}

?>