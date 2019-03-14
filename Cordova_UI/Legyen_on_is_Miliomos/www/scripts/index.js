// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );
    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
       // displayForm('formA');
    };
    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };
    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();
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
    $("#welcome").css("display", "none");
    $("#signup_form").css("display", "block");
	$("#login_form").css("display", "none");
}  
function ShowLogin(){
    //makes login form visible
    $("#signup_form").css("display", "none");
    $("#login_form").css("display", "block");
	$("#welcome").css("display", "none");
}   
function ShowMainMenu(user){
    //makes main menu visible
    $("#welcome").css("display", "none");
    $("#login_form").css("display", "none");
    $("#mainmenu").css("display", "block");
    $("#playground").css("display", "none");
	$("#greet").append(user);
} 
function ShowPlayground(){
    // makes question form visible
    $("#welcome").css("display", "none");
    $("#mainmenu").css("display", "none");
	$("#playground").css("display", "block")
} 
function Signup(){
    //implements signup function via ajax call
    var username=$("input[name='s_username']").val();
    var email=$("input[name='s_email']").val();
    var password=$("input[name='s_password']").val();
    $.ajax({
        type:'POST',
        url: 'https://thejumper203.ddns.net/~webuser/milliomos/signup.php',
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
       url: 'https://thejumper203.ddns.net/~webuser/milliomos/login.php',
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
        url: 'https://thejumper203.ddns.net/~webuser/milliomos/getQuestions.php',
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
                $("#answer"+i).html(q[rnd]);
                filled.push(rnd);
                i++;
        }
        else if(filled.length<4) rnd=Math.floor(Math.random()*4+2); 
    }
}
function CheckAnswer(buttonid){
    //checks the given answer, and gets the next one
    if ($(buttonid).text()===rightanswer) {
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
//function displayForm(formName) {
//    // kikapcsolja az összes formot és megjeleníti a paraméterként kapottat
//    document.getElementById('formA').style.display = 'none';
//    document.getElementById('formB').style.display = 'none';
//    document.getElementById('formC').style.display = 'none';
//    document.getElementById(formName).style.display = '';
//}

//function loginServerRq() {
//    var username = document.getElementById('uname').value.toLowerCase();
//    var password = document.getElementById('pword').value.toLowerCase();
//    var requestData = 'username=' + username + '&password=' + password;
//   httpRequest('https://thejumper203.ddns.net/~webuser/milliomos/login.php', requestData, { content: "application/x-www-form-urlencoded" }, loginOk, loginError);
//    }
//function cancelForm() {
//    document.getElementById('uname').value = '';
//    document.getElementById('pword').value = '';
//}
//function loginOk(response) {
//    if (response == "false") {
//        alert("helytelen jelszó");
//    } else {
//       /*/ document.getElementById('app').hidden = true;
//        document.getElementById('succes').innerHTML = response;
//        document.getElementById('Login').style.visibility = "visible";
//        document.getElementById('usern').hidden = true;
//        document.getElementById('pass').hidden = true;
//        document.getElementById('but').hidden = true;/*/
//        displayForm('formB');

//    }
//}

//function loginError() {
//    alert('login error');
//}
//function httpRequest(url, data, option, success, fallback) {
//    var xmlhttp = new XMLHttpRequest();
//    xmlhttp.onreadystatechange = function () {
//        if (xmlhttp.readyState === 4) {
//            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
//                if (typeof success === 'function') {
//                    success(xmlhttp.responseText);
//                }
//            } else {
//                if (typeof fallback === 'function') {
//                    fallback(xmlhttp.statusText);
//                }
//            }
//        }

//    };
//    xmlhttp.onerror = function (e) {
//        fallback(e.statusText);
//    };
//    var method = (data) ? 'POST' : 'GET';
//    if (option.user && option.password) {
//        xmlhttp.open(method, url, true);
//        xmlhttp.setRequestHeader('Authorization', 'Basic' + btoa(option.user + ':' + option.password));
//    } else {
//        xmlhttp.open(method, url, true);
//    }
//    if (option.content) {
//        xmlhttp.setRequestHeader('Content-Type', option.content);
//    }

//    xmlhttp.send(data);
//}
