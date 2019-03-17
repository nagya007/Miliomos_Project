<?php
    require_once './sqlcredits.php';
    session_start();
    if ($_POST["user"]==$_SESSION["session_user"]) {
        $questionnumber=$_POST["questionnumber"];
        //$sql = "SELECT * FROM question ORDER BY RAND() LIMIT $questionnumber;";
        $sql="select id,question,right0,wrong1,wrong2,wrong3,level 
            from (select *, @row:=if(level=@level,@row,0)+1 as rn, @level:=level from 
            (select *,RAND() as trand from question_test) t1,
            (select @row:=0,@level:='') tm2 
            order by level,trand) t2 where rn<=1;";
        mysqli_set_charset($sqlconn, "utf8");
        $result = $sqlconn->query($sql);
        $rows=array();
        while($row= mysqli_fetch_assoc($result))
        {
            $rows[]=$row;
        
        }
        echo json_encode($rows);
    }
    else echo "Permission denied";
?>