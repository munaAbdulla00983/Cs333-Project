<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  // Include DB config
  require_once 'connection.php';

  // Initialize DB connection
  $database = new Database();
  $conn = $database->getConnection();

  // Read input
  $data = json_decode(file_get_contents("php://input"), true);

// Validate input
  $requiredFields = ['Cname', 'Ccode', 'MeetingTime',   'Faculty', 'Gdesc'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["message" => "$field is required."]);
        exit();
    }
}
// Prepare insert
try {
    $checkQuery = "SELECT COUNT(*) FROM study_group WHERE Ccode = :Ccode";
    $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bindParam(':Ccode', $data['Ccode']);
    $checkStmt->execute();
    $exists = $checkStmt->fetchColumn() > 0;

    if ($exists) {
        // Record exists → update
        $updateQuery = "UPDATE study_group 
                        SET Gname = :Cname, MeetingTime = :MeetingTime, Faculty = :Faculty, Gdesc = :Gdesc 
                        WHERE Ccode = :Ccode";
        $stmt = $conn->prepare($updateQuery);

        $stmt->bindParam(':Cname', $data['Cname']);
        $stmt->bindParam(':MeetingTime', $data['MeetingTime']);
        $stmt->bindParam(':Faculty', $data['Faculty']);
        $stmt->bindParam(':Gdesc', $data['Gdesc']);

        $stmt->bindParam(':Ccode', $data['Ccode']);
    } else {
        // Record doesn't exist → insert
        $insertQuery = "INSERT INTO study_group ( Gname, Ccode, MeetingTime, Faculty, Gdesc)
                        VALUES ( :Cname, :Ccode, :MeetingTime, :Faculty, :Gdesc)";
        $stmt = $conn->prepare($insertQuery);

        $stmt->bindParam(':Cname', $data['Cname']);
        $stmt->bindParam(':Ccode', $data['Ccode']);
        $stmt->bindParam(':MeetingTime', $data['MeetingTime']);
        $stmt->bindParam(':Faculty', $data['Faculty']);
        $stmt->bindParam(':Gdesc', $data['Gdesc']);
    }



    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Study group created successfully."]);
    } else {
        throw new Exception("Database insert failed.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error inserting study group.", "error" => $e->getMessage()]);
}

?>