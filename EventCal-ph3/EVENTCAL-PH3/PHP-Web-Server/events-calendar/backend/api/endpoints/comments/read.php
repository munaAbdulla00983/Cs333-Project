<?php
// Read comments endpoint
include_once __DIR__ . '/../../config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

// Get event ID
$event_id = isset($_GET['event_id']) ? $_GET['event_id'] : null;

if (!$event_id) {
    http_response_code(400);
    echo json_encode(array("message" => "Event ID is required"));
    exit();
}

try {
    // Get comments for the event
    $query = "SELECT * FROM comments WHERE event_id = :event_id ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':event_id', $event_id);
    $stmt->execute();
    
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "comments" => $comments,
        "total" => count($comments)
    ));
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Database error",
        "error" => $e->getMessage()
    ));
}
?>