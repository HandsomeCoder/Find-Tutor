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
				document.getElementById("nameSection").innerHTML = request.responseText;
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', 'http://localhost:8080/reqNameToChat', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();
}

function getNamesOfPendingReq(){
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				document.getElementById("waitingForResponse").innerHTML = "Waiting for Response\n"+request.responseText;
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', 'http://localhost:8080/reqNameOfPending', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();	
}
function getNamesOfWaitingForAccept(){
	var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				document.getElementById("waitingforApproval").innerHTML = "\nWaiting For Approval\n"+request.responseText;
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', 'http://localhost:8080/reqNameOfWaiting', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();	
}
