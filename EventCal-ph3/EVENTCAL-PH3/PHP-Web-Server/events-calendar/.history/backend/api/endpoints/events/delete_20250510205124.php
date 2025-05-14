<?php
// Delete event endpoint
include_once '../../config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

// Get event ID
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(array("message" => "Event ID is required"));
    exit();
}

try {
    // Check if event exists
    $checkQuery = "SELECT id FROM events WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $id);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "Event not found"));
        exit();
    }
    
    // Prepare delete query
    $query = "DELETE FROM events WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    // Execute query
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array(
            "message" => "Event deleted successfully",
            "id" => $id
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to delete event"));
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Database error",
        "error" => $e->getMessage()
    ));
}
?>