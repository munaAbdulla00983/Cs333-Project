<?php
// Update event endpoint
include_once __DIR__ . '/../../config/database.php';

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

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (
    empty($data->title) ||
    empty($data->date) ||
    empty($data->location) ||
    empty($data->description) ||
    empty($data->category)
) {
    http_response_code(400);
    echo json_encode(array("message" => "Missing required fields"));
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
    
    // Prepare update query
    $query = "UPDATE events 
              SET title = :title, 
                  date = :date, 
                  location = :location, 
                  description = :description, 
                  category = :category, 
                  image_url = :image_url
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    // Sanitize and bind data
    $title = htmlspecialchars(strip_tags($data->title));
    $date = htmlspecialchars(strip_tags($data->date));
    $location = htmlspecialchars(strip_tags($data->location));
    $description = htmlspecialchars(strip_tags($data->description));
    $category = htmlspecialchars(strip_tags($data->category));
    $image_url = !empty($data->image_url) ? htmlspecialchars(strip_tags($data->image_url)) : null;
    
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':image_url', $image_url);
    
    // Execute query
    if ($stmt->execute()) {
        // Fetch the updated event
        $query = "SELECT * FROM events WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $event = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode(array(
            "message" => "Event updated successfully",
            "event" => $event
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to update event"));
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Database error",
        "error" => $e->getMessage()
    ));
}
?>