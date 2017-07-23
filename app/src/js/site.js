document.getElementById("search").onclick = function(){
	window.location.assign("../html/search.html");
}


document.getElementById("conversation").onclick = function(){
	window.location.assign("../html/conversation.html");
}


document.getElementById("profile-icon").onclick = function(){
	window.location.assign("../html/profile.html");
}

document.getElementById("logout").onclick = function(){
	var request = new XMLHttpRequest();
           
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				window.location.assign("../");
			} else {
				alert("Something went wrong, Try Again");
			}
		}
	};
	
	request.open('POST', '/logout', true);
    request.send();
}

