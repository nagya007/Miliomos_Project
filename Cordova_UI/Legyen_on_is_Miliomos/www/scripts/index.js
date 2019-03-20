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
var cnt = 0;  //question counter;
var lock=false;
function CancelLogin(){
    $("#welcome").css("display", "block");
    $("#login_form").css("display", "none");
    $("#mainmenu").css("display", "none");
    $("#playground").css("display", "none");  
}
function CancelSignup() {
    $("#welcome").css("display", "block");
    $("#login_form").css("display", "none");
    $("#mainmenu").css("display", "none");
    $("#playground").css("display", "none");
    $("#signup_form").css("display", "none");
}
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
	$("#btn_signup").attr("disabled","true");
    var username=$("input[name='s_username']").val();
    var email=$("input[name='s_email']").val();
    var password=$("input[name='s_password']").val();
    $.ajax({
        type:'POST',
        url: 'https://thejumper203.ddns.net/~webuser/milliomos/signup.php',
        data:'email='+email+'&username='+username+'&password='+password,
        success: function (data) {
			$("#btn_signup").removeAttr("disabled");
            if(data==="successful")  {alert("Successful registration. You can login now."); ShowLogin();}
            else if (data==="empty") alert ("You need to fill all fields");
            else if (data==="exist") alert("This user/email already exist");
        },
        error: function(){alert("Something went wrong");$("#btn_signup").removeAttr("disabled");}
    });
} 
function Login(){
    //implements login function via ajax call
	$("#btn_login").attr("disabled","true");
    var username=$("input[name='l_username']").val();
    var password=$("input[name='l_password']").val();
    $.ajax({
       type:'POST',
       url: 'https://thejumper203.ddns.net/~webuser/milliomos/login.php',
       data:'username='+username+'&password='+password,
       success: function(data){
		   $("#btn_login").removeAttr("disabled");
           if(data==="false") alert("Wrong username or password");
           else {
               session_user=username;
               ShowMainMenu(session_user);
           }
       },
       error: function(){alert("Something went wrong");$("#btn_login").removeAttr("disabled");}
    });
} 
function GetQuestions(){
    //recieves questions from database
    $.ajax({
        type:'POST',
        url: 'https://thejumper203.ddns.net/~webuser/milliomos/getQuestions.php',
        data:'questionnumber='+questionnumber+'&user='+session_user,
        dataType:'json',
        success: function (data)
        {
			questions=data;
            HelpEnableAll();
			$("#btn_startgame").removeAttr("disabled");
            if(questions.length===questionnumber){
				FillQuestion();
				ShowPlayground();    
			}
			else alert("There are not enough questions");
        },
        error: function (jqXHR, textStatus) {
            alert(' http request error' + textStatus);
			$("#btn_startgame").removeAttr("disabled");
            if (errorCb) {
                errorCb(jqXHR, textStatus);
            }
       }
        //error: function(){alert("Something went wrong. Failed to get questions");}
    }); 
} 
function SelectQuestion() {
    //select a question from "questions" field and return an array
        var selected=[];
        selected[0]=questions[cnt].id;
        selected[1]=questions[cnt].question;
        selected[2]=questions[cnt].right0;
        selected[3]=questions[cnt].wrong1;
        selected[4]=questions[cnt].wrong2;
        selected[5]=questions[cnt].wrong3;
        selected[6]=questions[cnt].level;
        cnt++;
		// Ami megjelenik a counteren
        $("#counter").html(cnt+" / "+questionnumber);
        previous.push(selected[0]);
        rightanswer=selected[2];
        return selected;
}
function StartGame(){
    //invokes GetQuestitons() function, then checks the count of received question and starts the game
	$("#btn_startgame").attr("disabled","true"); //disables the button to prevent multiple click, it will be re-enabled when the next function successes or fails
    GetQuestions();
}
function FillQuestion(){
    //fills a selected question and answers to the playing form
	    lock=false;
        for (i=1;i<5;i++)
        {
            $("#answer"+i).css("background","#000000");
            $("#answer"+i).css("color","rgba(255,255,255,0.9)");
            $("#answer"+i).css("animation","none");
            // vissza kapcsolja a gombokat, ha használva volt help ami kikapcsolná
            $("#answer"+i).removeAttr("disabled");
        }
        var q=SelectQuestion();
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
    if (!lock) {
        lock=true;
        $(buttonid).css("background","orange");
        $(buttonid).css("color","#000000");
        setTimeout(function(){
        if ($(buttonid).text()===rightanswer) {
            //alert("Good!");
           // $(buttonid).css("background","#00ff00");
            $(buttonid).css("color", "#FFFFFF");
            $(buttonid).css("animation", "wronganimation 0.5s infinite");
            setTimeout(function(){
                if (previous.length<questions.length) {
                 FillQuestion();
                } 
                else {
                    alert("You win!");
                    CleanUp();
                    ShowMainMenu();
                }
               },2000);          
        } 
        else {
            var rightbtnid="#answer";
            for(i=1;i<=4;i++)
            {
                if($("#answer"+i).text()===rightanswer) rightbtnid+=i;
            }
            $(buttonid).css("background","#ff0000");
            $(rightbtnid).css("animation","wronganimation 1s infinite");
            setTimeout(function(){
                alert("Wrong answer! You lost!");
                CleanUp();
                ShowMainMenu();
            },5000);

            }
        },3000);
    }
}
//Segítségek
// Eltüntet x rossz választ.
// Hány help tipus van leprogramozva.

// 1. = HelpRemove

///*

var HelpCount = 1;
function HelpDisable(index) {
    $("#help" + index).attr('disabled', 'true');
    // Kikapcsolás vagy eltüntetés is
    //$("#help" + index).style.display = "hidden";
}
// Bekapcsol egy speckó helpet - nem használt egyenlőre
function HelpEnable(index) {
    $("#help" + index).removeAttr("disabled");
    // lehet mind2 nem kell, de azért why not
    //$("#help" + index).style.display = "block";
}
function HelpEnableAll()
{
	// 1től kezdődő indexelés
	var i=1;
	while(i<HelpCount+1) {
        HelpEnable(i);
		i++;
	}
}
//*/
// 1. = Felezés, a.k.a Tüntess el x rossz választ
function HelpRemove(count)
{
    var i=0;
	while(i<count) {
		var rndButton = Math.floor(Math.random() * 4) + 1;
		// === ha egyezik változó tipusa, == ha egyezik 'a value' benne, megnézi üres-e már a gomb, vagy hogy rossz válasz-e
		if(!($("#answer"+rndButton).text()===rightanswer) && !($("#answer"+rndButton).text()==""))
		{
			$("#answer"+rndButton).html('');
			// disabled mint az agyam este 11kor
			$("#answer"+rndButton).attr('disabled', 'true');
			// Hidden akkor kell, ha azt akarjuk ne legyen ott a fekete gomb se.
			//$("#answer"+rndButton).hidden=true;
			//alert("teszt IF true");
			i++;
		}
    }

	// 1 = indexe
    HelpDisable(1);
}