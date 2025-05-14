<?php
// Read events endpoint
include_once '../../config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

try {
    // Check if getting single event
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($id) {
        // Get single event
        $query = "SELECT * FROM events WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $event = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($event) {
            http_response_code(200);
            echo json_encode($event);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Event not found"));
        }
    } else {
        // Get all events with filtering and pagination
        $query = "SELECT * FROM events WHERE 1=1";
        $countQuery = "SELECT COUNT(*) as total FROM events WHERE 1=1";
        $params = array();
        
        // Add search functionality
        if (!empty($_GET['search'])) {
            $searchTerm = '%' . $_GET['search'] . '%';
            $query .= " AND (title LIKE :search OR description LIKE :search OR location LIKE :search)";
            $countQuery .= " AND (title LIKE :search OR description LIKE :search OR location LIKE :search)";
            $params['search'] = $searchTerm;
        }
        
        // Add category filter
        if (!empty($_GET['category'])) {
            $query .= " AND category = :category";
            $countQuery .= " AND category = :category";
            $params['category'] = $_GET['category'];
        }
        
        // Add date filter
        if (!empty($_GET['date'])) {
            $query .= " AND date = :date";
            $countQuery .= " AND date = :date";
            $params['date'] = $_GET['date'];
        }
        
        // Add sorting
        $sort = $_GET['sort'] ?? 'date';
        $order = $_GET['order'] ?? 'ASC';
        $allowedSorts = ['date', 'title', 'created_at'];
        $allowedOrders = ['ASC', 'DESC'];
        
        if (in_array($sort, $allowedSorts) && in_array($order, $allowedOrders)) {
            $query .= " ORDER BY $sort $order";
        } else {
            $query .= " ORDER BY date ASC";
        }
        
        // Get total count
        $countStmt = $db->prepare($countQuery);
        foreach ($params as $key => $value) {
            $countStmt->bindValue(':' . $key, $value);
        }
        $countStmt->execute();
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Add pagination
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;
        
        $query .= " LIMIT :limit OFFSET :offset";
        
        // Execute main query
        $stmt = $db->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Return response
        http_response_code(200);
        echo json_encode(array(
            "events" => $events,
            "total" => $total,
            "page" => $page,
            "limit" => $limit,
            "pages" => ceil($total / $limit)
        ));
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Database error",
        "error" => $e->getMessage()
    ));
}
?>