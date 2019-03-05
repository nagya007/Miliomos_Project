<?php
function createConnection() {
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$dbname = "milliomos";

	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	
	return $conn;
}
?>