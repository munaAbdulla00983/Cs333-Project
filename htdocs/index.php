<?php
// Allow CORS and set response content type to JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Set the default timezone to Bahrain
date_default_timezone_set('Asia/Bahrain');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Setup DB connection
$host = "127.0.0.1";
$user = getenv("db_user");
$pass = getenv("db_pass");
$db   = getenv("db_name");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET time_zone = '+03:00'");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed."]);
    exit;
}

// Parse URI path
$uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), "/");
$path = explode("/", $uri);
$method = $_SERVER['REQUEST_METHOD'];
$apiIndex = array_search("index.php", $path);

// Unified response function
function respond($code, $data) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Validate endpoint
if (
    $apiIndex === false ||
    !isset($path[$apiIndex + 1]) ||
    $path[$apiIndex + 1] !== "endpoint" ||
    !isset($path[$apiIndex + 2]) ||
    $path[$apiIndex + 2] !== "news"
) {
    respond(200, ["message" => "Campus News API is active"]);
}

// Extract path parameters
$newsId = $path[$apiIndex + 3] ?? null;
$subPath = $path[$apiIndex + 4] ?? null;
$commentId = $path[$apiIndex + 5] ?? null;

// Handle GET requests
if ($method === "GET") {
    // List or search news posts
    if (!$newsId) {
        $search = $_GET["search"] ?? "";
        $category = $_GET["category"] ?? "";
        $page = max(1, intval($_GET["page"] ?? 1));
        $limit = 6;
        $offset = ($page - 1) * $limit;

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM news WHERE title LIKE :search AND (:category = '' OR category = :category)");
        $countStmt->bindValue(":search", "%$search%", PDO::PARAM_STR);
        $countStmt->bindValue(":category", $category, PDO::PARAM_STR);
        $countStmt->execute();
        $totalCount = $countStmt->fetchColumn();
        $totalPages = ceil($totalCount / $limit);

        $sort = $_GET["sort"] ?? "latest";
        $orderBy = $sort === "oldest" ? "ASC" : "DESC";

        $stmt = $pdo->prepare("SELECT * FROM news WHERE title LIKE :search AND (:category = '' OR category = :category) ORDER BY published_at $orderBy LIMIT :limit OFFSET :offset");
        $stmt->bindValue(":search", "%$search%", PDO::PARAM_STR);
        $stmt->bindValue(":category", $category, PDO::PARAM_STR);
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        respond(200, ["data" => $posts, "totalPages" => $totalPages]);
    }

    // Get single news post
    if (is_numeric($newsId) && !$subPath) {
        $stmt = $pdo->prepare("SELECT * FROM news WHERE id = ?");
        $stmt->execute([$newsId]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$post) respond(404, ["error" => "News post not found with ID: $newsId"]);
        respond(200, $post);
    }

    // Get comments for a post
    if ($subPath === "comments" && is_numeric($newsId)) {
        $stmt = $pdo->prepare("SELECT * FROM comments WHERE news_id = ? ORDER BY created_at