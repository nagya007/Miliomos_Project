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
    };
    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };
    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})(); 
function loginServerRq() {
    var username = document.getElementById('uname').value.toLowerCase();
    var password = document.getElementById('pword').value.toLowerCase();
    var requestData = 'username=' + username + '&password=' + password;
    httpRequest('https://thejumper203.ddns.net/~webuser/milliomos/login.php', requestData, { content: "application/x-www-form-urlencoded" }, loginOk, loginError);
    }
function cancelForm() {
    document.getElementById('uname').value = '';
    document.getElementById('pword').value = '';
}
function loginOk(response) {
    alert(response);
    if (response == "false") {
        alert("helytelen jelszó");
    }
}

function loginError() {
    alert('login error');
}
function httpRequest(url, data, option, success, fallback)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                if (typeof success === 'function') {
                    success(xmlhttp.responseText);
                }
            } else {
                if (typeof fallback === 'function') {
                    fallback(xmlhttp.statusText);
                }
            }
        }

    };
    xmlhttp.onerror = function (e) {
        fallback(e.statusText);
    };
    var method = (data) ? 'POST' : 'GET';
    if (option.user && option.password) {
        xmlhttp.open(method, url, true);
        xmlhttp.setRequestHeader('Authorization', 'Basic' + btoa(option.user+':'+option.password));
    } else {
        xmlhttp.open(method, url, true);
    }
    if (option.content) {
        xmlhttp.setRequestHeader('Content-Type', option.content);
    }
   // xmlhttp.setRequestHeader('Content-Type', "application/x-www-form-urlencoded" )
    xmlhttp.send(data);
  }