<?php
// Allow CORS and set response content type to JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Set timezone
date_default_timezone_set('Asia/Bahrain');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// DB connection using Replit environment variables
$host = "127.0.0.1";
$user = getenv("db_user");
$pass = getenv("db_pass");
$db   = getenv("db_name");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

$name = $data["name"] ?? '';
$comment = $data["comment"] ?? '';
$news_id = $data["news_id"] ?? '';

// Validate inputs
if (!$name || !$comment || !$news_id) {
    echo json_encode(["message" => "Missing required fields"]);
    exit;
}

// Insert into comments table
try {
    $stmt = $pdo->prepare("INSERT INTO comments (news_id, author, comment_text, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$news_id, $name, $comment]);
    echo json_encode(["message" => "Comment posted successfully"]);
} catch (PDOException $e) {
    echo json_encode(["message" => "Failed to post comment: " . $e->getMessage()]);
}
?>
