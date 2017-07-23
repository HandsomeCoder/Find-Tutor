var signInForm = document.getElementById("signInForm");
var signInButton = document.getElementById("submit");

signInForm.onsubmit = function(){
	
	var uname = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	
	var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				signInButton.value = 'Sucess';
				window.location.assign("../html/profile.html");
            } else {
				signInButton.innerHTML = request.responseText;
			}
		}
	};
	request.open('POST','/login', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: uname,password: pass}));  
    signInButton.innerHTML = 'Signing In...';	

};
