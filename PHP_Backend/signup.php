<?php
    include './sqlcredits.php';
    $username=trim($_POST["username"]);
    $email=trim($_POST["email"]);
    $pwhash= password_hash(trim($_POST["password"]),PASSWORD_DEFAULT);
    $sqlq="insert into users (username,pwhash,email) values ('$username','$pwhash','$email')";
    $sqlconn->query($sqlq);
    $sqlconn->close();
    header("Location: login.html");
?>
