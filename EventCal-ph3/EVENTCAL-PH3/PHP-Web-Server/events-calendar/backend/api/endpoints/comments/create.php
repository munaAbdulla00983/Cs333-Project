<?php
// Create comment endpoint
include_once __DIR__ . '/../../config/database.php';

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
    
    // Sanitize and bind data
    $event_id = htmlspecialchars(strip_tags($data->event_id));
    $author_name = htmlspecialchars(strip_tags($data->author_name));
    $content = htmlspecialchars(strip_tags($data->content));
    
    $stmt->bindParam(':event_id', $event_id);
    $stmt->bindParam(':author_name', $author_name);
    $stmt->bindParam(':content', $content);
    
    // Execute query
    if ($stmt->execute()) {
        $comment_id = $db->lastInsertId();
        
        // Fetch the created comment
        $query = "SELECT * FROM comments WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $comment_id);
        $stmt->execute();
        
        $comment = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201);
        echo json_encode(array(
            "message" => "Comment created successfully",
            "comment" => $comment
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to create comment"));
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Database error",
        "error" => $e->getMessage()
    ));
}
?>