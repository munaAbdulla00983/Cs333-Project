<?php
// Create comment endpoint
include_once '../../config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (
    empty($data->event_id) ||
    empty($data->author_name) ||
    empty($data->content)
) {
    http_response_code(400);
    echo json_encode(array("message" => "Missing required fields"));
    exit();
}

try {
    // Check if event exists
    $checkQuery = "SELECT id FROM events WHERE id = :event_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':event_id', $data->event_id);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "Event not found"));
        exit();
    }
    
    // Prepare insert query
    $query = "INSERT INTO comments (event_id, author_name, content) 
              VALUES (:event_id, :author_name, :content)";
    
    $stmt = $db->prepare($query);