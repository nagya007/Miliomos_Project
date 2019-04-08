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
var scorenumber=10; //number of requested scores
var rightanswer=""; //the right answer of actual question is stored here
var questions;  //received questions are stored here
var scores; //received scores are stored here
var previous=[];    //array for previous question ids
var cnt = 0;  //question counter;
var lock=false; //locks answer buttons after clicking one
//----------------------
//these urls can be used for application, uncomment the line what you want to use
//var url="https://thejumper203.ddns.net/~webuser/milliomos/";  //my own webserver
var url="https://milliomos.000webhostapp.com/"; //free webhost server
//var url="./"; //localhost for web use
//----------------------
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
	$("#playground").css("display", "block");
}
//Fejlesztés alatt!! Score táblát jeleníti (majd) meg. Egy kóbor frontendes megcsinálhatja nyugodtan! :)
/*function ShowScores(){
    // makes scores form visible
    $("#welcome").css("display", "none");
    $("#mainmenu").css("display", "none");
	$("#playground").css("display", "block");
} */


function Signup(){
    //implements signup function via ajax call
	$("#btn_signup").attr("disabled","true")
        ;
    var username=$("input[name='s_username']").val();
    var email=$("input[name='s_email']").val();
    var password=$("input[name='s_password']").val();
    $.ajax({
        type:'POST',
        url: url+'signup.php',
        data:'email='+email+'&username='+username+'&password='+password,
		timeout: 5000,
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
       url: url+'login.php',
       data:'username='+username+'&password='+password,
	   timeout: 5000,
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
        url: url+'getQuestions.php',
        data:'questionnumber='+questionnumber+'&user='+session_user,
        dataType:'json',
		timeout: 5000,
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
    ByeAudi();
	GetQuestions();
	FillScoreboard();
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
	// Scoreboard körvonalazódik, 1ről kezdődik
	HighlightScoreboard(cnt-1);
}
function CheckAnswer(buttonid){
    //checks the given answer, and gets the next one
    if (!lock) {
        lock = true;
        HelpEinsteinRefuse();
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
// 2. = Einstein
///*

var HelpCount = 3;
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
		if(!($("#answer"+rndButton).text()===rightanswer) && !($("#answer"+rndButton).text()===""))
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

// EINSTEIN
function HelpTip1(){
    
	var weights=[2,5,83,6];
	for	(i=1;i<=4;i++)
	{
		if($("#answer"+i).text()===rightanswer)
		{
			var temp=weights[i-1];
			weights[i-1]=83-questions[cnt-1].level;
			weights[2]=temp;
		}
	}
	var sumweight=0;
	for (i=0;i<weights.length;i++) sumweight+=weights[i];
	var rnd=Math.floor(Math.random()*sumweight)+1;
	for (i=0;i<weights.length;i++){
		if(rnd<weights[i]) {		
			return i+1;
			}
		rnd-=weights[i];
	}
	
}
function HelpEinstein(){
	HelpDisable(2);
	$("#einstein_anwser").html($("#answer"+HelpTip1()).text());
	$("#help_einstein").css("display", "block");
}


function HelpEinsteinRefuse(){
	$("#help_einstein").css("display", "none");
}
//Közönség szavazás
//Generál 4 számot amit leoszt az összegükkel, hogy fasza százalékokká változzanak. A helyes válasz +30% boostot kap.
//String tömböt ad vissza amiben az eredmények sorrendje a gombok sorrendjét követi.
function AskTheAudience() {
    HelpDisable(3);
    $("#ask_Audi").css("display", "block");
	var tips = new Array(4);
	var sum=0;
	for (i=0;i<=3;i++)
	{
		if($("#answer"+(i+1)).text()===rightanswer)
		{
			tips[i] = (Math.floor(Math.random() * 100) + 1)+80; //Itt állítható a boost.
			sum += tips[i];
		}
		else
		{
			tips[i] = Math.floor(Math.random() * 100) + 1;
			sum += tips[i];
		}
    }
    var floatips = new Array(4);



    for (i = 0; i <= 3; i++) {
        tips[i] = (tips[i] / sum).toFixed(2); //.toFixed() a tizedesjegyet állítja és!!! stringre alakít!!!
        floatips[i] = parseFloat(tips[i])*100;
    }

    var a = document.getElementById("audition");
    var atx = a.getContext("2d");
    //atx.rect(0, 0, 30, floatips[0]);
    atx.rect(15, 0, floatips[0]*2, 15);
    atx.fillStyle = "darkblue";
    atx.fill();
    atx.beginPath();

        var b = document.getElementById("audition");
        var btx = b.getContext("2d");
        btx.beginPath();
        //btx.rect(40, 0, 30, floatips[1]);
        btx.rect(15, 20, floatips[1]*2, 15);
        btx.fillStyle = "darkblue";
        btx.fill();

        var c = document.getElementById("audition");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        //ctx.rect(80, 0, 30, floatips[2]);
        ctx.rect(15, 40, floatips[2]*2, 15);
        ctx.fillStyle = "darkblue";
        ctx.fill();

        var d = document.getElementById("audition");
        var dtx = d.getContext("2d");
        dtx.beginPath();
        //dtx.rect(120, 0, 30, floatips[3]);
        dtx.rect(15, 60, floatips[3]*2, 15);
        dtx.fillStyle = "darkblue";
        dtx.fill();
}

function ByeAudi() {
    $("#ask_Audi").css("display", "none");
    
}
//Fejlesztés alatt!!
/*function GetScores(){
    //recieves scores from database
    $.ajax({
        type:'POST',
        url: url+'getScores.php',
        data:'scorenumber='+scorenumber,
        dataType:'json',
		timeout: 5000,
        success: function (data)
        {
			scores=data;
				FillScores();
				ShowScores();    
        },
        error: function (jqXHR, textStatus) {
            alert(' http request error' + textStatus);
            if (errorCb) {
                errorCb(jqXHR, textStatus);
            }
       }
        //error: function(){alert("Something went wrong. Failed to get questions");}
    }); 
}
//Score táblát tölti fel (majd)
function FillScores(){
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
}*/
function FillScoreboard()
{
	var table = document.getElementById("scoreboard_table");
	//Clear
	table.innerHTML = '<caption id="counter"></caption>';
	// Csak megadjuk ezt az értéket neki, de questionnumber is lehetne a változó minden részbe itt
	// max nehéz lenne átlátni :D
	// Mennyit lehet nyerni
    var price = [
	  5000,
	  10000,
	  25000,
	  50000,
	  250000,
	  500000,
	  1000000,
	  5000000,
	  25000000,
	  50000000,
	  100000000,
	  250000000, 
	  500000000,
	  1000000000,
	  2000000000,
	  5000000000,
	  25000000000,
	  50000000000,
	  100000000000,
	  250000000000
	]; 
	var number = questionnumber;
    for (i = 0; i < number; i++) {
      var j = 0; // First Cell
      var k = 1; // Second Cell
      var newTR = table.insertRow(i);
      var newTD1 = newTR.insertCell(j);
      var newTD2 = newTR.insertCell(j+1);
	  var index=number-i-1;
	  newTD1.id = "scoreboard"+index; // ID amire hivatkozunk később
      //newTD1.innerHTML = "Row " + i + " Cell " + j;
      newTD1.innerHTML = newTD1.id;
	  newTD2.innerHTML = "Ft";
    }
	// Nem kell szétszedni, de gyakorlás révén hagytam így az element IDvel hivatkozva teszt
	for (i = 0; i < number; i++) {
		var s = document.getElementById("scoreboard"+i);
		// Eltérés, hogy alulról nőjön az érték!
		s.innerHTML = price[i];	
    }
}
function HighlightScoreboard(index)
{
	document.getElementById("scoreboard"+index).style.border = "thick solid #0000FF";  
	if(index!=0)
	{
		document.getElementById("scoreboard"+(index-1)).style.border = "";  
	}
}