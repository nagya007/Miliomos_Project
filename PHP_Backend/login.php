<?php
	header("Access-Control-Allow-Origin:*");
    require_once "./sqlcredits.php";
    session_start();
    $username=$sqlconn->real_escape_string($_POST["username"]);
    $password=$sqlconn->real_escape_string($_POST["password"]);
    if ($username != "" && $password != "") 
        {
            $result= $sqlconn->query("select * from users where username='$username'");
            $data= mysqli_fetch_assoc($result);
            if(mysqli_num_rows($result)==1 && password_verify($password, $data["pwhash"])) {
                $_SESSION["session_user"]=$data["username"];
                echo "success";
            }
            else echo "false";
        }
        else echo "false";
        
?>
