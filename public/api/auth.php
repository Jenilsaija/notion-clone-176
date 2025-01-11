<?php
include 'db.php';
require 'jwt.php';
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$requesdata = json_decode(file_get_contents('php://input'), true);
$action = $requesdata['action'];
$arrResponse = array(
    "status"=>false
);

if ($method == "POST") {
    switch ($action) {
        case 'LOGIN':
            $arrResponse = validateLogin($requesdata,$conn);
            break;

        case 'MAKE':
            $arrResponse = createUser($requesdata,$conn);
            break;

        default:
            $arrResponse["message"] = "Invalid request method";
            break;
    }
}

echo json_encode($arrResponse);
$conn->close();

function createUser($requesdata,$conn){
    $arrResponse = array(
        "status"=>false,
        "message"=>"Invalid Api Response"
    );
    $email=$requesdata['email'];
    $password=$requesdata['password'];
    
    //check if email already exists.
    $result = $conn->query("SELECT * FROM users WHERE email='".$requesdata['email']."'");
    if (!($result->num_rows > 0)) {
        $result = $conn->query("INSERT INTO users (email, password) VALUES ('".$email."', '".$password."')");
        $objJwt = new JWT();
    
        $arrResponse["status"] = true;
        $arrResponse["message"] = "User Registerd successfully";
        $arrResponse["userToken"] = $objJwt->getJwtwithData(array("email"=>$email));
    } else {
        $arrResponse["message"] = "Email already exists";
    }
    
    return $arrResponse;
}

function validateLogin($requesdata,$conn){
    $arrResponse = array(
        "status"=>false
    );

    $objJwt = new JWT();
    //verify email and password.
    $result = $conn->query("SELECT * FROM users WHERE email='".$requesdata['email']."' AND password='".$requesdata['password']."'");
    $data = $result->fetch_assoc();

    if ($data) {
        $arrResponse["status"] = true;
        $arrResponse["userToken"] = $objJwt->getJwtwithData($data);
    }else{
        $arrResponse["message"] = "Invalid email or password";
    }

    return $arrResponse;
}


?>