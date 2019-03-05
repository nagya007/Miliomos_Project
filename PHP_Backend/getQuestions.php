<?php
function getQuestions(conn){
	$sql = "SELECT * FROM questions ORDER BY RAND() LIMIT 10";
	$result = $conn->query($sql);

	$jsonResult = json_encode($result)
    return jsonResult;
}
?>