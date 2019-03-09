<?php
    include_once './sqlcredits.php';
    $questionnumber=$_POST["questionnumber"];
    $sql = "SELECT * FROM question ORDER BY RAND() LIMIT $questionnumber;";
    $result = $sqlconn->query($sql);
    $rows=array();
    while($row= mysqli_fetch_assoc($result))
    {
        $rows[]=$row;
    }
    echo json_encode($rows);
?>