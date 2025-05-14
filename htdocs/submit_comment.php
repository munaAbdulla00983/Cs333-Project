
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

date_default_timezone_set('Asia/Bahrain');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = "0.0.0.0";
$user = getenv("db_user");
$pass = getenv("db_pass");
$db   = getenv("db_name");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => true, "message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true) ?? $_POST;

    $name = $data["name"] ?? '';
    $comment = $data["comment"] ?? '';
    $news_id = $data["news_id"] ?? '';

    if (!$name || !$comment || !$news_id) {
        echo json_encode(["error" => true, "message" => "Missing required fields"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO comments (news_id, author, comment_text, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$news_id, $name, $comment]);
        echo json_encode(["error" => false, "message" => "Comment posted successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["error" => true, "message" => "Failed to post comment: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => true, "message" => "Invalid request method"]);
}
?>
