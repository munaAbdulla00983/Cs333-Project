<?php
// Check if accessing API endpoints
if (strpos($_SERVER['REQUEST_URI'], '/events-calendar/backend/api') !== false) {
    // Let the request pass through to the API
    // The PHP server will handle the routing
    return false;
} else {
    // Redirect to frontend
    header("Location: /events-calendar/frontend/index.html");
    exit();
}
?>