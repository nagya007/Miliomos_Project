<?php
    include "./sqlcredits.php";
    session_start();
    if (isset($_POST['username']) && isset($_POST['password'])) 
        {
            $username=$_POST["username"];
            $password=$_POST["password"];
            $sqlq="select * from users where username='$username'";
            $result= mysqli_query($sqlconn, $sqlq);
            $data= mysqli_fetch_assoc($result);
            if(mysqli_num_rows($result)==1 && password_verify($password, $data["pwhash"])) {
                echo "success <br>";
                $_SESSION["session_user"]=$data["username"];
                echo "welcome <b>".$_SESSION["session_user"]."</b>!";
            }
            else echo "false";
        }
            
?>
