<?php
include 'db.php';
require 'jwt.php';
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$requesdata = json_decode(file_get_contents('php://input'), true);
$action = $requesdata['action'] ? $requesdata['action'] : ""; 
if (isset($_SERVER['HTTP_AUTH_TOKEN'])) {
    $authtoken = $_SERVER['HTTP_AUTH_TOKEN'];
}

$arrResponse = array("status"=>false);

if (isset($authtoken) && !empty($authtoken)) {
    $flagValidTokenstatus = validateUserThroughToken($authtoken,$conn);
    $flagValidToken = $flagValidTokenstatus['status'];
    $userID = $flagValidTokenstatus['userid'];

    if ($method == "POST" && $flagValidToken) {
        switch ($action) {
            case 'NOTES.CREATE':
                include_once './Notes/createNotes.php';
                break;

            case 'NOTES.LIST':
                include_once './Notes/fetchallNotes.php';
                break;
            
            case 'NOTES.UPDATE':
                include_once './Notes/updateNotes.php';
                break;

            case 'NOTES.DELETE':
                include_once './Notes/deleteNotes.php';
                break;

            default:
                $arrResponse["message"] = "Invalid action";
                break;
        }
    }else{
        $arrResponse["message"] = "unauthorized";
    }
}else{
    $arrResponse["message"] = "unauthorized";
}


if (isset($arrResponse)) {
    echo json_encode($arrResponse);
} 

$conn->close();

function validateUserThroughToken($authtoken,$conn){
    $objJwt = new JWT();
    $userData = $objJwt->validateToken($authtoken);
    if (!empty($userData)) {
        $result = $conn->query("SELECT * FROM users WHERE email='".$userData->email."' AND password='".$userData->password."'");
        $data = $result->fetch_assoc();
    
        if($result->num_rows > 0){  
            return array("status"=>true,"userid"=>$data['recid']);
        }
        return false;
    }
}
?>