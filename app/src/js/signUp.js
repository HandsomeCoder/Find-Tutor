var signUpForm = document.getElementById("signUpForm");
var signUpButton = document.getElementById("submit");

signUpForm.onsubmit = function(){
	
	var uname = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	var userrole = document.getElementById("role").value;
	
	var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				signUpButton.value = 'Sucess';
				window.location.assign("../html/profile.html");
            } else if (request.status === 403) {
				signUpButton.innerHTML = 'Username already Exsit';
				
            } else {
				signUpButton.innerHTML = request.responseText;
			}
		}
	};
	request.open('POST', 'http://localhost:8080/signup', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: uname,password: pass,role: userrole}));  
    signUpButton.innerHTML = 'Registering...';	

};

var confirmpassword = document.getElementById("confirmpassword")

confirmpassword.onblur = function() {
	var password = document.getElementById("password").value;
	var message = document.getElementById("message");
	
	if(password === confirmpassword.value){
		signUpButton.disabled = false;
		message.innerHTML = "Password matched";
		message.style.color = "green";
	} else {
		message.innerHTML = "Password didn't matched";
		message.style.color = "red";
	}
}
