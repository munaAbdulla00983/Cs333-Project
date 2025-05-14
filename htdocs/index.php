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
$user = $_ENV["db_user"];
$pass = $_ENV["db_pass"];
$db   = $_ENV["db_name"];

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
        $stmt = $pdo->prepare("SELECT * FROM comments WHERE news_id = ? ORDER BY created_at ASC");
        $stmt->execute([$newsId]);
        respond(200, $stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

// Handle POST requests
if ($method === "POST") {
    // Add new comment
    if ($subPath === "comments" && is_numeric($newsId)) {
        $data = json_decode(file_get_contents("php://input"), true);
        $comment = htmlspecialchars(trim($data["comment"] ?? ""), ENT_QUOTES, 'UTF-8');
        $author = htmlspecialchars(trim($data["author"] ?? "Anonymous"), ENT_QUOTES, 'UTF-8');
        if (strlen($comment) < 3 || strlen($author) < 2) {
            respond(400, ["error" => "Invalid comment input."]);
        }
        $stmt = $pdo->prepare("INSERT INTO comments (news_id, author, comment_text, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$newsId, $author, $comment]);
        respond(201, ["message" => "Comment added."]);
    }

    // Create new news post
    if (!$newsId && !$subPath) {
        $title = htmlspecialchars(trim($_POST["title"] ?? ""), ENT_QUOTES, 'UTF-8');
        $content = htmlspecialchars(trim($_POST["content"] ?? ""), ENT_QUOTES, 'UTF-8');
        $category = htmlspecialchars(trim($_POST["category"] ?? ""), ENT_QUOTES, 'UTF-8');
        $author = htmlspecialchars(trim($_POST["author"] ?? "Campus Hub"), ENT_QUOTES, 'UTF-8');

        if (strlen($title) < 5 || strlen($content) < 20 || strlen($category) < 3) {
            respond(400, ["error" => "Invalid news input."]);
        }

        // Handle image upload
        $imageName = null;
        if (isset($_FILES["image"]) && is_uploaded_file($_FILES["image"]["tmp_name"])) {
            $allowed = ["image/jpeg", "image/png", "image/gif"];
            $type = mime_content_type($_FILES["image"]["tmp_name"]);
            if (in_array($type, $allowed)) {
                $ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
                $imageName = uniqid("img_", true) . bin2hex(random_bytes(3)) . ".$ext";
                move_uploaded_file($_FILES["image"]["tmp_name"], __DIR__ . "/uploads/$imageName");
            }
        }

        $stmt = $pdo->prepare("INSERT INTO news (title, content, category, author, image, published_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$title, $content, $category, $author, $imageName]);
        respond(201, ["message" => "News created."]);
    }
}

// Handle PUT requests
if ($method === "PUT") {
    // Update comment
    if ($subPath === "comments" && isset($commentId) && is_numeric($newsId)) {
        $data = json_decode(file_get_contents("php://input"), true);
        $text = htmlspecialchars(trim($data["comment_text"] ?? ""), ENT_QUOTES, 'UTF-8');
        if (strlen($text) < 3) respond(400, ["error" => "Invalid comment."]);
        $stmt = $pdo->prepare("UPDATE comments SET comment_text = ? WHERE id = ? AND news_id = ?");
        $stmt->execute([$text, $commentId, $newsId]);
        respond(200, ["message" => "Comment updated."]);
    }

    // Update news post
    if (is_numeric($newsId)) {
        parse_str(file_get_contents("php://input"), $data);
        $title = htmlspecialchars(trim($data["title"] ?? ""), ENT_QUOTES, 'UTF-8');
        $content = htmlspecialchars(trim($data["content"] ?? ""), ENT_QUOTES, 'UTF-8');
        $category = htmlspecialchars(trim($data["category"] ?? ""), ENT_QUOTES, 'UTF-8');
        $author = htmlspecialchars(trim($data["author"] ?? "Campus Hub"), ENT_QUOTES, 'UTF-8');
        $published_at = htmlspecialchars(trim($data["published_at"] ?? ""), ENT_QUOTES, 'UTF-8');

        if (strlen($title) < 5 || strlen($content) < 20 || strlen($category) < 3) {
            respond(400, ["error" => "Invalid news input."]);
        }

        $stmt = $pdo->prepare("UPDATE news SET title = ?, content = ?, category = ?, author = ?, published_at = ? WHERE id = ?");
        $stmt->execute([$title, $content, $category, $author, $published_at, $newsId]);
        respond(200, ["message" => "News updated."]);
    }
}

// Handle DELETE requests
if ($method === "DELETE") {
    // Delete comment
    if ($subPath === "comments" && isset($commentId) && is_numeric($newsId)) {
        $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ? AND news_id = ?");
        $stmt->execute([$commentId, $newsId]);
        respond(204, []); // No Content
    }

    // Delete news post
    if (is_numeric($newsId) && !$subPath) {
        $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
        $stmt->execute([$newsId]);
        respond(204, []); // No Content
    }
}

// Fallback if no route matched
respond(404, ["error" => "Invalid request"]);
