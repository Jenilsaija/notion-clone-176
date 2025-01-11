<?php
$servername = "localhost";
$username = "u467268751_jenil";
$password = "Jenil@72452!176012";
$dbname = "u467268751_tlsnotes";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>