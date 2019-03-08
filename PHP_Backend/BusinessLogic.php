<?php
    function getQuestions($conn){
        $sql = "SELECT * FROM question ORDER BY RAND() LIMIT 10;";
        $result = $conn->query($sql);
        $rows=array();
        while($row= mysqli_fetch_assoc($result))
        {
            $rows["questions"][]=$row;
        }
        return json_encode($rows);
    }
?>
