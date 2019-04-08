<?php
    header("Access-Control-Allow-Origin:*");
    require_once './sqlcredits.php';
    $username=$sqlconn->real_escape_string(trim($_POST["username"]));
    $email=$sqlconn->real_escape_string(trim($_POST["email"]));
    $password=$sqlconn->real_escape_string(trim($_POST["password"]));
    if ($username != "" && $email != "" && $password != "") {
        if (mysqli_num_rows($sqlconn->query("select id from users where username='$username' or email='$email'"))) {
            echo "exist";
        }
        else {
            $pwhash= password_hash($password,PASSWORD_DEFAULT);
            if($sqlconn->query("insert into users (username,pwhash,email) values ('$username','$pwhash','$email')")){
			$sqlconn->query("insert into score (userid) select id from users where username='$username'");
            echo "successful";
			}
        }    
    }
    else echo "empty";
?>
