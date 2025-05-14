<?php
// API Router
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse the request URL
$request_uri = $_SERVER['REQUEST_URI'];
$script_name = $_SERVER['SCRIPT_NAME'];
$path_info = str_replace(dirname($script_name), '', $request_uri);
$path_info = str_replace('/index.php', '', $path_info);
$path_info = explode('?', $path_info)[0];
$segments = array_filter(explode('/', $path_info));
$segments = array_values($segments);

// Determine the resource and action
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;

// Get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Route the request
switch ($resource) {
    case 'events':
        switch ($method) {
            case 'GET':
                if ($id) {
                    // Get single event
                    $_GET['id'] = $id;
                }
                include 'endpoints/events/read.php';
                break;
            case 'POST':
                include 'endpoints/events/create.php';
                break;
            case 'PUT':
                if ($id) {
                    $_GET['id'] = $id;
                }
                include 'endpoints/events/update.php';
                break;
            case 'DELETE':
                if ($id) {
                    $_GET['id'] = $id;
                }
                include 'endpoints/events/delete.php';
                break;
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
        break;
        
    case 'comments':
        switch ($method) {
            case 'GET':
                include 'endpoints/comments/read.php';
                break;
            case 'POST':
                include 'endpoints/comments/create.php';
                break;
            case 'DELETE':
                if ($id) {
                    $_GET['id'] = $id;
                }
                include 'endpoints/comments/delete.php';
                break;
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
        break;
        
    case 'search':
        if ($method == 'GET') {
            include 'endpoints/events/search.php';
        } else {
            http_response_code(405);
            echo json_encode(array("message" => "Method not allowed"));
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(array("message" => "Endpoint not found"));
        break;
}
?>