function getNames(){
		getNamesToChat();
		getNamesOfPendingReq();
		getNamesOfWaitingForAccept();
}

function getNamesToChat(){
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				document.getElementById("nameSection").innerHTML += request.responseText;
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', '/reqNameToChat', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();
}

function getNamesOfPendingReq(){
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				if(request.responseText === "" ){
					document.getElementById("waitingForResponse").innerHTML += "No Pending Request";
				}
				else{
					document.getElementById("waitingForResponse").innerHTML += request.responseText;
				}
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', '/reqNameOfPending', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();	
}
function getNamesOfWaitingForAccept(){
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				if(request.responseText === ""){
					document.getElementById("waitingforApproval").innerHTML += "No Waiting Request";
				} else {
					document.getElementById("waitingforApproval").innerHTML += request.responseText;
				}
			} else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', '/reqNameOfWaiting', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();	
}

var receiver_user_id;
function chat(x){
	receiver_user_id = x;
	document.getElementById("textArea").style.visibility = "visible";
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				document.getElementById("chatBox").innerHTML = request.responseText;
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', '/loadChat', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({user_id: x}));	
}

function accept(x){
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				getNames();
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', '/acceptRequest', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({user_id: x}));	
}

function cancel(x){
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				getNames();
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', '/cancelRequest', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({user_id: x}));	
}

var chatForm = document.getElementById("messageForm");
chatForm.onsubmit = function(){
	
	var msg = document.getElementById("message").value;
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				chat(receiver_user_id);
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', '/sendMsg', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({user_id: receiver_user_id,msg: msg}));		
}
