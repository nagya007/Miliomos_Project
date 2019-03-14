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
var session_user = "";
var questionnumber = 10;
var rightanswer = "";
var questions;
var previous = [];
function CleanUp() {
    rightanswer = "";
    questions = null;
    previous = [];
}
function ShowSignup() {
    $("#welcome").css("display", "none");
    $("#signup_form").css("display", "block");
    $("#login_form").css("display", "none");
}
function ShowLogin() {
    $("#signup_form").css("display", "none");
    $("#login_form").css("display", "block");
    $("#welcome").css("display", "none");
}
function ShowMainMenu(user) {
    $("#welcome").css("display", "none");
    $("#login_form").css("display", "none");
    $("#mainmenu").css("display", "block");
    $("#playground").css("display", "none");
    $("#greet").append(user);
}
function ShowPlayground() {
    $("#welcome").css("display", "none");
    $("#mainmenu").css("display", "none");
    $("#playground").css("display", "block");
}
function Signup() {
    var username = $("input[name='s_username']").val();
    var email = $("input[name='s_email']").val();
    var password = $("input[name='s_password']").val();
    $.ajax({
        type: 'POST',
        url: 'https://thejumper203.ddns.net/~webuser/milliomos/signup.php',
        //url: 'https://milliomos.000webhostapp.com/signup.php',
        data: 'email=' + email + '&username=' + username + '&password=' + password,
        success: function (data) {
            if (data === "successful") { alert("Successful registration. You can login now."); ShowLogin(); }
            else if (data === "empty") alert("You need to fill all fields");
            else if (data === "exist") alert("This user/email already exist");
        },
        error: function () { alert("Something went wrong"); }
    });
}
function Login() {
    var username = $("input[name='l_username']").val();
    var password = $("input[name='l_password']").val();
    $.ajax({
        type: 'POST',
          url: 'https://thejumper203.ddns.net/~webuser/milliomos/login.php',
        //url: 'https://milliomos.000webhostapp.com/login.php',
        data: 'username=' + username + '&password=' + password,
        success: function (data) {
            if (data === "false") alert("Wrong username or password");
            else {
                session_user = username;
                alert(data);
                ShowMainMenu(session_user);
            }
        },
        error: function () { alert("Something went wrong"); }
    });
}
function GetQuestions() {
    $.ajax({
        type: 'POST',
       url: 'https://thejumper203.ddns.net/~webuser/milliomos/getQuestions.php',
        //url: 'https://milliomos.000webhostapp.com/Questions.php',
        data: 'questionnumber=' + questionnumber,
        dataType: 'json',
        async: false,
        success: function (data) {
            questions = data;
        }
    });
}
function SelectQuestion() {
    questionnumber = 10;

    while (true) {
        var rnd = Math.floor(Math.random() * (questionnumber));
        console.log("Random: " + rnd + " | " + previous);
        if (!previous.includes(questions[rnd].id)) {
            var selected = [];
            selected[0] = questions[rnd].id;
            selected[1] = questions[rnd].question;
            selected[2] = questions[rnd].right0;
            selected[3] = questions[rnd].wrong1;
            selected[4] = questions[rnd].wrong2;
            selected[5] = questions[rnd].wrong3;
            selected[6] = questions[rnd].level;
            previous.push(selected[0]);
            rightanswer = selected[2];
            return selected;
        }
    }
}
function StartGame() {
    ShowPlayground();
    GetQuestions();
    FillQuestion();
}
function FillQuestion() {
    var q = SelectQuestion();
    $("#questiontext").text(q[1]);
    var i = 1;
    var filled = [];
    while (i <= 4) {
        var rnd = Math.floor(Math.random() * 4 + 2);
        if (!filled.includes(rnd) && rnd <= 5 && rnd >= 2) {
            $("#answer" + i).html(q[rnd]);
            filled.push(rnd);
            i++;
        }
        else if (filled.length < 4) rnd = Math.floor(Math.random() * 4 + 2);
    }
}
function CheckAnswer(buttonid) {
    if ($(buttonid).text() === rightanswer) {
        alert("Good!");
        if (previous.length < questionnumber) {
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
