<?php
// Create event endpoint
include_once __DIR__ . '/../../config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

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
    // Prepare insert query
    $query = "INSERT INTO events (title, date, location, description, category, image_url) 
              VALUES (:title, :date, :location, :description, :category, :image_url)";
    
    $stmt = $db->prepare($query);
    
    // Sanitize and bind data
    $title = htmlspecialchars(strip_tags($data->title));
    $date = htmlspecialchars(strip_tags($data->date));
    $location = htmlspecialchars(strip_tags($data->location));
    $description = htmlspecialchars(strip_tags($data->description));
    $category = htmlspecialchars(strip_tags($data->category));
    $image_url = !empty($data->image_url) ? htmlspecialchars(strip_tags($data->image_url)) : null;
    
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':image_url', $image_url);
    
    // Execute query
    if ($stmt->execute()) {
        $event_id = $db->lastInsertId();
        
        // Fetch the created event
        $query = "SELECT * FROM events WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $event_id);
        $stmt->execute();
        
        $event = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201);
        echo json_encode(array(
            "message" => "Event created successfully",
            "event" => $event
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to create event"));
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Database error",
        "error" => $e->getMessage()
    ));
}
?>