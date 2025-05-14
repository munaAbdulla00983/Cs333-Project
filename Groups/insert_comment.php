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
  $requiredFields = ['Sname', 'Gname','Comment'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["message" => "$field is required."]);
        exit();
    }
}

// Prepare insert
try {
    $query = "INSERT INTO comments (Sname,Gname, Comment)
              VALUES (:Sname, :Gname, :Comment)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':Sname', $data['Sname']);
    $stmt->bindParam(':Gname', $data['Gname']);
    $stmt->bindParam(':Comment', $data['Comment']);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Comment posted successfully."]);
    } else {
        throw new Exception("There is some errors.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error posting commnet.", "error" => $e->getMessage()]);
}
?>