<?php
    header("Access-Control-Allow-Origin:*");
    require_once './sqlcredits.php';
    $username=trim($_POST["username"]);
    $email=trim($_POST["email"]);
    $password=trim($_POST["password"]);
    if ($username != "" && $email != "" && $password != "") {
        $checkexist="select id from users where username='$username' or email='$email'";
        if (mysqli_num_rows($sqlconn->query($checkexist))) {
            echo "exist";
        }
        else {
            $pwhash= password_hash($password,PASSWORD_DEFAULT);
            $sqlq="insert into users (username,pwhash,email) values ('$username','$pwhash','$email')";
            $sqlconn->query($sqlq);
            //header("Location: login.html");
            echo "successful";
        }    
    }
    else echo "empty";
?>
