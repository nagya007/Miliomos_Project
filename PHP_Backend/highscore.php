<?php
    header("Access-Control-Allow-Origin:*");
    require_once './sqlcredits.php';
    
    $user=$_POST["user"];
    $score=$_POST["score"];
    $result= $sqlconn->query("select score.money from score inner join users on score.userid=users.id where users.username='$user'");
    $highscore= mysqli_fetch_assoc($result);
    if($score>$highscore["money"])
    {
        $sqlconn->query("update score set money=$score where userid=(select id from users where username='$user')");
    }
    