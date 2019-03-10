var session_user="";
var questionnumber=10;
var rightanswer="";
var questions;
var previous=[];
function CleanUp(){
    rightanswer="";
    questions=null;
    previous=[];
}
function ShowSignup(){
    $("#signup_form").css("display","block");
    $("#login_form").css("display","none");
}
function ShowLogin(){
    $("#signup_form").css("display","none");
    $("#login_form").css("display","block");
}
function ShowMainMenu(user){
    $("#login_form").css("display","none");
    $("#mainmenu").css("display","block");
    $("#playground").css("display","none");
    $("#greet").append(user);
}
function ShowPlayground(){
    $("#mainmenu").css("display","none");
    $("#playground").css("display","block");
}
function Signup(){
    var username=$("input[name='s_username']").val();
    var email=$("input[name='s_email']").val();
    var password=$("input[name='s_password']").val();
    $.ajax({
        type:'POST',
        url:'signup.php',
        data:'email='+email+'&username='+username+'&password='+password,
        success: function (data) {
            if(data==="successful")  {alert("Successful registration. You can login now."); ShowLogin();}
            else if (data==="empty") alert ("You need to fill all fields");
            else if (data==="exist") alert("This user/email already exist");
        },
        error: function(){alert("Something went wrong");}
    });
}
function Login(){
    var username=$("input[name='l_username']").val();
    var password=$("input[name='l_password']").val();
    $.ajax({
       type:'POST',
       url:'login.php',
       data:'username='+username+'&password='+password,
       success: function(data){
           if(data==="false") alert("Wrong username or password");
           else {
               session_user=username;
               alert(data);
               ShowMainMenu(session_user);
           }
       },
       error: function(){alert("Something went wrong");}
    });
}
function GetQuestions(){
    $.ajax({
        type:'POST',
        url:'./getQuestions.php',
        data:'questionnumber='+questionnumber,
        dataType:'json',
        async:false,
        success: function (data)
        {
            questions=data;
        }
    }); 
}
function SelectQuestion() {
    questionnumber=10;

    while(true)
    {             
        var rnd=Math.floor(Math.random()*(questionnumber));
        console.log("Random: "+rnd+" | "+previous);
        if (!previous.includes(questions[rnd].id)) {
        var selected=[];
        selected[0]=questions[rnd].id;
        selected[1]=questions[rnd].question;
        selected[2]=questions[rnd].right0;
        selected[3]=questions[rnd].wrong1;
        selected[4]=questions[rnd].wrong2;
        selected[5]=questions[rnd].wrong3;
        selected[6]=questions[rnd].level;
        previous.push(selected[0]);
        rightanswer=selected[2];
        return selected;
        }
    } 
}
function StartGame(){
    ShowPlayground();
    GetQuestions();
    FillQuestion();
}
function FillQuestion(){
        var q=SelectQuestion();
        $("#questiontext").text(q[1]);
        var i=1;
        var filled=[];
        while(i<=4) {
            var rnd=Math.floor(Math.random()*4+2);
            if (!filled.includes(rnd) && rnd<=5 &&rnd>=2) {
                $("#answer"+i).val(q[rnd]);
                filled.push(rnd);
                i++;
        }
        else if(filled.length<4) rnd=Math.floor(Math.random()*4+2); 
    }
}
function CheckAnswer(buttonid){
    if ($(buttonid).val()===rightanswer) {
        alert("Good!");
        if (previous.length<questionnumber) {
        FillQuestion();
        } 
        else {
            alert("You win!");
            CleanUp();
            ShowMainMenu();
        }
    } 
    else {
        alert("Wrong answer! You lost!");
        CleanUp();
        ShowMainMenu();
    }
}