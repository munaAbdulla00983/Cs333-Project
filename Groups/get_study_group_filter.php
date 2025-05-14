<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'connection.php';

$database = new Database();
$conn = $database->getConnection();
 $data = json_decode(file_get_contents("php://input"), true);
// Validate input
  $requiredFields = ['text', 'Faculty', 'sortby'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["message" => "$field is required."]);
        exit();
    }
}

try {
    $query = "SELECT * FROM study_group ";
    $where="where ";
    if($data['text']!=  "null" ){
        $where=$where."Gname like '%".$data['text']."%' or Ccode like '%".$data['text']."%' or Gdesc like '%".$data['text']."%'";
    }
    if($data['Faculty']!==  "Filter by Faculty" ){
        if($data['text']!=  "null" ){
        $where=$where." and ";
        }
        $where=$where." Faculty = '".$data['Faculty']."'";
    }

    if($where!="where "){
    $query=$query.$where;
    }
    if($data['sortby']!=  "Sort by" ){
            $query=$query." order by MeetingTime";
    }
    $query=$query.";";
    $stmt = $conn->prepare($query);

    $stmt->execute();

    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($groups);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching data", "error" => $e->getMessage()]);
}
