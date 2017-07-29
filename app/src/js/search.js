var searchForm = document.getElementById("searchForm");

searchForm.onsubmit = function(){
	var request = new XMLHttpRequest();
	var result = document.getElementById("result");
	var searchBtn = document.getElementById("searchBtn");
	
	var country = document.getElementById("country").value;
	var state = document.getElementById("state").value;
	var city = document.getElementById("city").value;
	
	request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				if(request.responseText === ""){
					result.innerHTML = "<h2>No Result Found</h2>";	
				}else{
					result.innerHTML = request.responseText;
				}
				searchBtn.innerHTML = 'Search'
			} else if (request.status === 403) {
				result.innerHTML = 'Username already Exsit';		
			} else if (request.status === 401) {
				window.location.assign("../");	
			} else {
				result.innerHTML = request.responseText;
			}
		}
	};
	request.open('POST', '/search', true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({country: country, state: state, city: city}));  
	searchBtn.innerHTML = 'Searching...';
}

function viewProfile(user_id,role,i){
	var viewProfileBtn = document.getElementById("viewProfileBtn_"+i).innerHTML;
	if(viewProfileBtn === "View Profile"){
		var request = new XMLHttpRequest();

		request.onreadystatechange = function () {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {

					document.getElementById("viewUserProfile"+i).innerHTML = request.responseText;
					document.getElementById("viewProfileBtn_"+i).innerHTML = "Close Profile";
					getViewInfo('basicInfo',user_id);
				} else if (request.status === 403) {
			
				} else {
			
				}
			}
		};
		request.open('POST', '/viewProfile', true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify({user_id: user_id,role: role}));	
	} else {
		document.getElementById("viewUserProfile"+i).innerHTML = "";
		document.getElementById("viewProfileBtn_"+i).innerHTML = "View Profile";
	}
}


function getViewInfo(table, user_id){
	
	var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				var content = request.responseText;
				document.getElementById("infoSection"+user_id).innerHTML = content.toString();
            } else {
				alert("Something went wrong, Try again")
			}
		}
	};
	request.open('POST', '/viewInfo', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({table: table,user_id: user_id}));  
}

function sendMsg(x){
	var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				alert(request.responseText)
            } else {
				alert(request.responseText)
			}
		}
	};
	request.open('POST', '/reqChat', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({rec_user_id: x})); 
}
