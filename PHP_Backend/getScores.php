<?php
	header("Access-Control-Allow-Origin:*");
    require_once './sqlcredits.php';
	
	$scorenumber=$_POST["scorenumber"];
	//$sql = "SELECT name, score FROM score ORDER BY score LIMIT $scorenumber;";
        $sql="select users.username, score.money from users inner join score on users.id=score.userid order by score.money desc limit $scorenumber";
	mysqli_set_charset($sqlconn, "utf8");
	$result = $sqlconn->query($sql);
	$rows=array();
	while($row= mysqli_fetch_assoc($result))
	{
		$rows[]=$row;
	}
	echo json_encode($rows);
?>