<?php
    include './sqlcredits.php';
    $username=trim($_POST["username"]);
    $pwhash= password_hash(trim($_POST["password"]),PASSWORD_DEFAULT);
    $sqlq="insert into Users (username,password) values ('$username','$pwhash')";
    $sqlconn->query($sqlq);
    $sqlconn->close();
    header("Location: login.html");
?>