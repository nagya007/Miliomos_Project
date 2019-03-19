var session_user="";  //name of actually logged in user
var questionnumber=10; //number of requested questions
var rightanswer=""; //the right answer of actual question is stored here
var questions;  //received questions are stored here
var previous=[];    //array for previous question ids
var cnt=0;  //question counter;
function CleanUp(){
    //at the end of a game, this function clear these fields
    rightanswer=""; 
    questions=null; 
    previous=[]; 
    cnt=0;  
}
function ShowSignup(){
    //makes signup form visible
    $("#signup_form").css("display","block");
    $("#login_form").css("display","none");
}  
function ShowLogin(){
    //makes login form visible
    $("#signup_form").css("display","none");
    $("#login_form").css("display","block");
}   
function ShowMainMenu(user){
    //makes main menu visible
    $("#login_form").css("display","none");
    $("#mainmenu").css("display","block");
    $("#playground").css("display","none");
    $("#greet").append(user);
} 
function ShowPlayground(){
    // makes question form visible
    $("#mainmenu").css("display","none");
    $("#playground").css("display","block");
} 
function Signup(){
    //implements signup function via ajax call
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
    //implements login function via ajax call
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
    //recieves questions from database
    $.ajax({
        type:'POST',
        url:'./getQuestions.php',
        data:'questionnumber='+questionnumber+'&user='+session_user,
        dataType:'json',
        async:false,
        success: function (data)
        {
            questions=data;
        },
        error: function(){alert("Something went wrong. Failed to get questions");}
    }); 
} 
function SelectQuestion(flag) {
    //select a question from "questions" field and return an array
    if(flag){
        while(true)
        {             
            var rnd=Math.floor(Math.random()*(questions.length));
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
    else {
        var selected=[];
        selected[0]=questions[cnt].id;
        selected[1]=questions[cnt].question;
        selected[2]=questions[cnt].right0;
        selected[3]=questions[cnt].wrong1;
        selected[4]=questions[cnt].wrong2;
        selected[5]=questions[cnt].wrong3;
        selected[6]=questions[cnt].level;
        cnt++;
        previous.push(selected[0]);
        rightanswer=selected[2];
        return selected;
    }
}
function StartGame(){
    //invokes GetQuestitons() function, then checks the count of received question and starts the game
    GetQuestions();
    if(questions.length==questionnumber){
    FillQuestion();
    ShowPlayground();
    }
    else alert("There are not enough questions");
}
function FillQuestion(){
    //fills a selected question and answers to the playing form
        var q=SelectQuestion(false);
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
    //checks the given answer, and gets the next one
    if ($(buttonid).val()===rightanswer) {
        alert("Good!");
        if (previous.length<questions.length) {
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