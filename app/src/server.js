var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');


var app = express();
app.use(bodyParser.json());

app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30},
    resave: true,
    saveUninitialized: true
}));

var port = 8080; 
app.listen(8080, function () {
  console.log(`Find Tutor app listening on port ${port}!`);
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/html/:htmlFile', function (req, res) {
  res.sendFile(path.join(__dirname, 'html',req.params.htmlFile));
});

app.get('/css/:cssFile', function (req, res) {
  res.sendFile(path.join(__dirname, 'css',req.params.cssFile));
});

app.get('/images/:img', function (req, res) {
  res.sendFile(path.join(__dirname, 'images',req.params.img));
});

app.get('/js/:jsFile', function (req, res) {
  res.sendFile(path.join(__dirname, 'js',req.params.jsFile));
});

app.post('/signup', function (req, res) {
	var request = require('request');
	request.post({
		 url: "http://auth.c100.hasura.me/signup",
		 headers: {
			"Content-Type": "application/json"
		 },
		 body: {
			"username": req.body.username,
			"password": req.body.password
		 },
		 json:true
	}, function(error, response, body){
//	   console.log(JSON.stringify(response.body));
		if(response.statusCode === 200){
			console.log("User Created"+response.statusCode+""+response.body);
			assignRole(response.body.hasura_id,response.body.auth_token,req.body.role);
			
			req.session.auth = {
				user_id: response.body.hasura_id,
				username: req.body.username,
				token: response.body.auth_token,
				role: req.body.role
			};
			
			res.status(response.statusCode).send("Registered!")
		} else {
			console.log("Failed"+response.statusCode+""+JSON.stringify(response.body.message));
			res.status(response.statusCode).send(JSON.stringify(response.body.message));
		}
	});
});

function assignRole(id,token,role){
	console.log(id+" "+token+" "+role)
	var request = require('request');
	request.post({
		 url: "http://data.c100.hasura.me/v1/query",
		 headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+token
		 },
		 body: {
			"type": "insert",
			"args": {
				"table": "user_role",
				"objects": [{
						"user_id": id,
						"role": role
					}]
			}
		},
		json:true
	}, function(error, response, body){
//	   console.log(JSON.stringify(response.body));
		if(response.statusCode === 200){
			console.log("User role assigned");
		}
	});	
}

app.post('/login', function (req, res) {
	var request = require('request');
	request.post({
		 url: "http://auth.c100.hasura.me/login",
		 headers: {
			"Content-Type": "application/json"
		 },
		 body: {
			"username": req.body.username,
			"password": req.body.password
		 },
		 json:true
	}, function(error, response, body){
//	   console.log(JSON.stringify(response.body));
		if(response.statusCode === 200){
			console.log("User Created"+response.statusCode+" "+response.body);
			
			req.session.auth = {
				user_id: response.body.hasura_id,
				username: req.body.username,
				token: response.body.auth_token
			};
			getRole(req,res,response.body.hasura_id,response.body.auth_token);
		} else {
			console.log("Failed"+response.statusCode+""+JSON.stringify(response.body.message));
			res.status(response.statusCode).send(JSON.stringify(response.body.message));
		}
	});
});

app.post('/logout', function (req, res) {
	var request = require('request');
	request.post({
		 url: "http://auth.c100.hasura.me/user/logout",
		 headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+req.session.auth.token
		 },
		 body: {},
		 json:true
	}, function(error, response, body){
//	   console.log(JSON.stringify(response.body));
		if(response.statusCode === 200){
			res.status(response.statusCode).send("logout")
		} else {
			console.log("Failed"+response.statusCode+""+JSON.stringify(response.body.message));
			res.status(response.statusCode).send(JSON.stringify(response.body.message));
		}
	});
});

function getRole(req,res,user_id,token){
	var request = require('request');
	request.post({
		 url: "http://data.c100.hasura.me/v1/query",
		 headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+token
		 },
		 body: {
			"type": "select",
			"args": {
				"table": "user_role",
				"columns": ["role"],
				"where":{
					"user_id": user_id
				}
			}
		},
		json:true
	}, function(error, response, body){
//	   console.log(JSON.stringify(response.body));
		if(response.statusCode === 200){
			var responseRole = JSON.stringify(response.body[0].role);
			responseRole = responseRole.substr(1, responseRole.length-2)
			req.session.auth.role = responseRole;
			console.log(req.session.auth);
			res.status(response.statusCode).send("logged In!")
		} else {
			res.status(401).send("Something went wrong, Try Again");
		}
	});		
}

function checkSession(req){
    if(req.session && req.session.auth && req.session.auth.user_id){
        return true;
    }
    else{
        return false;
    }
}

app.post('/navOption', function (req, res) {
	
	if(checkSession(req)){
		console.log(req.session.auth.role);
		if(req.session.auth.role === "Student") {
			
			res.status(200).send(`
				<p onclick="getInfo('basicInfo')"> Basic Information </p>
				<p onclick="getInfo('location')"> Location </p>
				<p onclick="getInfo('education')"> Education </p>
				<p onclick="getInfo('requirements')"> Requirements </p>
			`);
		} else if (req.session.auth.role === "Tutor") {
			
			res.status(200).send(`
				<p onclick="getInfo('basicInfo')"> Basic Information </p>
				<p onclick="getInfo('location')"> Location </p>
				<p onclick="getInfo('qualification')"> Qualification </p>
				<p onclick="getInfo('skillset')"> Skillset </p>
			`);
		
		} else {
				res.status(401).send("Something went wrong, Try Again");
		}
	} else {
		res.status(401).send("Something went wrong, Try Again");
	}
});

function loadInfo(req,x,data){
	switch (x){
		case 'basicInfo' : 
			return `
					<div id="infoHeader">
						<p> Basic Information</p>
						<button onclick="edit('basicInfo')"> Edit </button>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> <label>Username: </label> </td>
								<td id="username">${req.session.auth.username}</td>
							</tr>
							
							<tr>
								<td> <label>First Name: </label> </td>
								<td id="firstname">${data.firstname}</td>
							</tr>
							
							<tr>
								<td> <label>Last Name: </label> </td>
								<td id="lastname">${data.lastname}</td>
							</tr>
							
							<tr>
								<td> <label>Gender: </label> </td>
								<td id="gender">${data.gender}</td>
							</tr>
						</table>
					</div>
			`;
			break;
		case 'location' : 
			return `
					<div id="infoHeader">
						<p> Loaction</p>
						<button onclick="edit('location')"> Edit </button>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Country: </td>
								<td id="country">${data.country}</td>
							</tr>
							
							<tr>
								<td> State: </td>
								<td id="state">${data.state}</td>
							</tr>
							
							<tr>
								<td> City:  </td>
								<td id="city">${data.city}</td>
							</tr>
						</table>
					</div>
			`;
			break;
		case 'education' : 
			return `
					<div id="infoHeader">
						<p> Education</p>
						<button onclick="edit('education')"> Edit </button>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Current Standard: </td>
								<td id="currentStd">${data.current_std}</td>
							</tr>
							
							<tr>
								<td> Board: </td>
								<td id="board">${data.board}</td>
							</tr>
							
							<tr>
								<td> Medium:  </td>
								<td id="medium">${data.medium}</td>
							</tr>
						</table>
					</div>
			`;
			break;
		case 'requirements' : 
			return `
					<div id="infoHeader">
						<p> Requirements</p>
						<button onclick="edit('requirements')"> Edit </button>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Requirements: </td>
								<td id="requirements">${data.requirement}</td>
							</tr>
						</table>
					</div>
			`;
			break;
		case 'qualification': 
			return `<div id="infoHeader">
						<p> Qualification</p>
						<button onclick="edit('qualification')"> Edit </button>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Degree: </td>
								<td id="degree">${data.degree}</td>
							</tr>
							
							<tr>
								<td> Recent College Attended: </td>
								<td id="college">${data.college}</td>
							</tr>
							
							<tr>
								<td> Field of Study:  </td>
								<td id="fieldofstudy">${data.field_of_study}</td>
							</tr>
							<tr>
								<td> Years of Experience:  </td>
								<td id="yoe">${data.year_of_experience}</td>
							</tr>
						</table>
					</div>`;
				break;
		case 'skillset': 
			return `
				<div id="infoHeader">
						<p> Skillsets</p>
						<button onclick="edit('skillset')"> Edit </button>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Skillset: </td>
								<td id="skillset">${data.skillset}</td>
							</tr>
						</table>
					</div>
		`;
		break;
	};		
}

app.post('/info', function (req, res) {
	
	var table = getTableName(req.body.info)
	
	if(checkSession(req)){
		
			var request = require('request');
			request.post({
				 url: "http://data.c100.hasura.me/v1/query",
				 headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+req.session.auth.token
				 },
				 body: {
					"type": "select",
					"args": {
						"table": table,
						"columns": ["*"],
						"where":{
							"user_id": req.session.auth.user_id
						}
					}
				},
				json:true
			}, function(error, response, body){
		//	   console.log(JSON.stringify(response.body));
				if(response.body[0] === undefined){
					console.log(response.body);
					res.status(404).send("no data available");
				}
				else{
					if(response.statusCode === 200){
						console.log(response.body);
						res.status(response.statusCode).send(loadInfo(req,req.body.info,response.body[0]))
					} else {
						console.log(response.body);
						res.status(401).send("Something went wrong, Try Again");
					}
				}
			});	
		//	res.status(200).send("inserted");
		
	} else {
		res.status(401).send("Something went wrong, Try Again");
	}
	


});

function getTableName(x){
	var table;
	switch(x){
		case 'basicInfo':
			table = "user_basic_info";
			break;
		case 'location':
			table = "user_location";
			break;
		case 'education':
			table = "student";
			break;
		case 'requirements':
			table = "requirements";
			break;
		case 'qualification':
			table = "tutor";
			break;
		case 'skillset':
			table = "skillsets";
			break;
	}
	
	return table;
}

app.post('/userInfo', function (req, res) {
	
	data = req.body.data;
	data["user_id"] = req.session.auth.user_id;
	
	table = req.body.table;
	table = getTableName(table);
	

	
	console.log(data);
	console.log(table);
	
	if(checkSession(req)){
		
			var request = require('request');
			request.post({
				 url: "http://data.c100.hasura.me/v1/query",
				 headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+req.session.auth.token
				 },
				 body: {
					"type": "insert",
					"args": {
						"table": table,
						"objects": [data]
					}
				},
				json:true
			}, function(error, response, body){
		//	   console.log(JSON.stringify(response.body));
				if(response.statusCode === 200){
					console.log(response.body);
					res.status(response.statusCode).send("inserted")
				} else {
					console.log(response.body);
					res.status(401).send("Something went wrong, Try Again");
				}
			});	
		//	res.status(200).send("inserted");
		
	} else {
		res.status(401).send("Something went wrong, Try Again");
	}
});

app.post('/search', function (req, res) {
	
	if(checkSession(req)){
	
		var country = req.body.country;
		var state = req.body.state;
		var city = req.body.city;
		
		console.log(JSON.stringify(country)+" "+JSON.stringify(state)+" "+JSON.stringify(state));
		
		var request = require('request');
		request.post({
			url: "http://data.c100.hasura.me/v1/query",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer "+req.session.auth.token
			},
			body: {
				"type": "select",
				"args": {
					"table": "user_location",
					"columns": ["*"],
					"where": {
						"country": country,
						"state": state,
						"city": city
					}
				}
			},
			json:true
		}, function(error, response, body){
				if(response.statusCode === 200){
					console.log(response.body);
					var users = []
					
					for(var i = 0;i < response.body.length;i++ ){
						users.push(response.body[i].user_id);
					}
					filterByRole(users,req,res);
				} else {
					console.log(response.body);
					res.status(401).send("Something went wrong, Try Again");
				}
			});
	} else {
		res.status(401).send("Unauthorized");
	}
});

function filterByRole(users,req,res){
	
	
	var role = req.session.auth.role;
	
	if(role === 'Student'){
		role = 'Tutor';
	} else if(role === 'Tutor'){
		role = 'Student';		
	}
	
	var request = require('request');
	request.post({
		url: "http://data.c100.hasura.me/v1/query",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+req.session.auth.token
		},
		body: {
			"type": "select",
			"args": {
				"table": "user_role",
				"columns": ["user_id","role",
					{
						"name": "user_profile",
						"columns": ["firstname","lastname","gender"]
					}
				],
				"where": {
					"role": role,
					"user_id":{"$in": users}
				}
			}
		},
		json:true
	}, function(error, response, body){
			if(response.statusCode === 200){
				var responseText = "";
				
				for(var i = 0;i < response.body.length;i++ ){
					
					user_id = response.body[i].user_id;
					role = response.body[i].role;
					responseText += `<div class="searchResult">
						<div class="searchNumber">
							<p>#${i+1}</p>
						</div>
						<div class="searchInfo">
							<p>${response.body[i].user_profile.firstname} ${response.body[i].user_profile.lastname}</p>
						</div>
						<div class="searchBtn">
							<button id="viewProfileBtn_${i+1}" onclick="viewProfile(${user_id},\'${role}\',${i+1})">View Profile</button>
							<button onclick="sendMsg(${user_id})">Send Message</button>
						</div>
					</div>
					<div id="viewUserProfile${i+1}">
					</div>`;
				}
				console.log(response.body);
				res.status(200).send(responseText);
			} else {
				console.log(response.body);
				res.status(401).send("Something went wrong, Try Again");
			}
		});
}

app.post('/viewProfile', function (req, res) {
	
	console.log(req.body);
	role = req.body.role;
	var navOption = ""
	
	if(role == "Student"){
		navOption = `
				<p onclick="getViewInfo('basicInfo',${req.body.user_id})"> Basic Information </p>
				<p onclick="getViewInfo('location',${req.body.user_id})"> Location </p>
				<p onclick="getViewInfo('education',${req.body.user_id})"> Education </p>
				<p onclick="getViewInfo('requirements',${req.body.user_id})"> Requirements </p>
			`
	} else {
		navOption = `
				<p onclick="getViewInfo('basicInfo',${req.body.user_id})"> Basic Information </p>
				<p onclick="getViewInfo('location',${req.body.user_id})"> Location </p>
				<p onclick="getViewInfo('qualification',${req.body.user_id})"> Qualification </p>
				<p onclick="getViewInfo('skillset',${req.body.user_id})"> Skillset </p>
			`
	}
	
	var viewProfileTemplate = `
			<div id="header">
				<p> Profile </p>
			</div>
			<div id="profileSection">
				<div id="subNavigator">
					<div id="profile-img-section">
						<img id="profile-img" src="../images/default_profile.jpg" alt="Profile">
					</div>
					<div id="navOptions">
						`+navOption+`
					</div>
				</div>
				<div class="profileSection" id="infoSection${req.body.user_id}">

				</div>
			</div>
	`;
	res.send(viewProfileTemplate);

});

app.post('/viewInfo', function (req, res) {
			
			var table = getTableName(req.body.table);
			var user_id = req.body.user_id;
			
			var request = require('request');
			request.post({
				 url: "http://data.c100.hasura.me/v1/query",
				 headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+req.session.auth.token
				 },
				 body: {
					"type": "select",
					"args": {
						"table": table,
						"columns": ["*"],
						"where":{
							"user_id": user_id
						}
					}
				},
				json:true
			}, function(error, response, body){
		//	   console.log(JSON.stringify(response.body));
				if(response.body[0] === undefined){
					console.log(response.body);
					res.status(404).send("no data available");
				}
				else{
					if(response.statusCode === 200){
						console.log(response.body);
						res.status(response.statusCode).send(loadProfileInfo(req,req.body.table,response.body[0]))
					} else {
						console.log(response.body);
						res.status(401).send("Something went wrong, Try Again");
					}
				}
			});	

});

function loadProfileInfo(req,table,data){
	switch (table){
		case 'basicInfo' : 
			return `
					<div id="infoHeader">
						<p> Basic Information</p>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> <label>First Name: </label> </td>
								<td id="firstname">${data.firstname}</td>
							</tr>
							
							<tr>
								<td> <label>Last Name: </label> </td>
								<td id="lastname">${data.lastname}</td>
							</tr>
							
							<tr>
								<td> <label>Gender: </label> </td>
								<td id="gender">${data.gender}</td>
							</tr>
						</table>
					</div>
			`;
			break;
		case 'location' : 
			return `
					<div id="infoHeader">
						<p> Loaction</p>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Country: </td>
								<td id="country">${data.country}</td>
							</tr>
							
							<tr>
								<td> State: </td>
								<td id="state">${data.state}</td>
							</tr>
							
							<tr>
								<td> City:  </td>
								<td id="city">${data.city}</td>
							</tr>
						</table>
					</div>
			`;
			break;
		case 'education' : 
			return `
					<div id="infoHeader">
						<p> Education</p>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Current Standard: </td>
								<td id="currentStd">${data.current_std}</td>
							</tr>
							
							<tr>
								<td> Board: </td>
								<td id="board">${data.board}</td>
							</tr>
							
							<tr>
								<td> Medium:  </td>
								<td id="medium">${data.medium}</td>
							</tr>
						</table>
					</div>
			`;
			break;
		case 'requirements' : 
			return `
					<div id="infoHeader">
						<p> Requirements</p>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Requirements: </td>
								<td id="requirements">${data.requirement}</td>
							</tr>
						</table>
					</div>
			`;
			break;
		case 'qualification': 
			return `<div id="infoHeader">
						<p> Qualification</p>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Degree: </td>
								<td id="degree">${data.degree}</td>
							</tr>
							
							<tr>
								<td> Recent College Attended: </td>
								<td id="college">${data.college}</td>
							</tr>
							
							<tr>
								<td> Field of Study:  </td>
								<td id="fieldofstudy">${data.field_of_study}</td>
							</tr>
							<tr>
								<td> Years of Experience:  </td>
								<td id="yoe">${data.year_of_experience}</td>
							</tr>
						</table>
					</div>`;
				break;
		case 'skillset': 
			return `
				<div id="infoHeader">
						<p> Skillsets</p>
					</div>
					<div id="content">
						<table id="displayContent">
							<tr>
								<td> Skillset: </td>
								<td id="skillset">${data.skillset}</td>
							</tr>
						</table>
					</div>
		`;
		break;
	};		
}

app.post('/reqChat', function (req, res) {
	if(checkRequest(req,res)){
		var request = require('request');
		request.post({
			url: "http://data.c100.hasura.me/v1/query",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer "+req.session.auth.token
			},
			body: {
				"type": "insert",
				"args": {
					"table": "request",
					"objects": [{
						"req_send_user_id":req.session.auth.user_id,
						"req_receiver_user_id": req.body.rec_user_id,
					}]
					
				}
			},
			json:true
		}, function(error, response, body){
				if(response.statusCode === 200){
					res.status(200).send("Request sent");
				} else if(response.statusCode === 400) {
					res.status(response.statusCode).send("Request already sent");
				}else{
					console.log(response.body);
					res.status(response.statusCode).send(response.body);
				}
			});
	}
})

app.post('/reqNameToChat', function (req, res) {
	
		
	var request = require('request');
	request.post({
		url: "http://data.c100.hasura.me/v1/query",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+req.session.auth.token
		},
		body: {
			"type": "select",
			"args": {
				"table": "request",
				"columns": ["req_receiver_user_id"],
				"where":{
					"$or": [{"req_send_user_id": req.session.auth.user_id},
					{"req_receiver_user_id": req.session.auth.user_id}],
					"req_status": "true"
				}
				
			}
		},
		json:true
	}, function(error, response, body){
			if(response.statusCode === 200){
				res.status(200).send(response.body);
			} else{
				console.log(response.body);
				res.status(response.statusCode).send(response.body);
			}
		});
})

function checkRequest(req,res){
var request = require('request');
	request.post({
		url: "http://data.c100.hasura.me/v1/query",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+req.session.auth.token
		},
		body: {
			"type": "select",
			"args": {
				"table": "request",
				"columns": ["req_status"],
				"where":{
					"req_send_user_id": req.body.rec_user_id,
					"req_receiver_user_id": req.session.auth.user_id,
				}
				
			}
		},
		json:true
	}, function(error, response, body){
			if(response.statusCode === 200){
				if(response.body[0] === undefined){
					console.log(response.body[0]);
					return true;
				}
				else{
					if(response.body[0].req_status === true){
						console.log("true");
						res.status(200).send("Request is already approved, you can chat");
					}
					else{
						console.log("false");
						res.status(200).send("Approve request to chat");
					}
				}
				return false;
			} else{
				console.log(response.body);
				return true;
			}
		});	
}

app.post('/reqNameOfPending', function (req, res) {
	
	var request = require('request');
	request.post({
		url: "http://data.c100.hasura.me/v1/query",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+req.session.auth.token
		},
		body: {
			"type": "select",
			"args": {
				"table": "request",
				"columns": ["req_send_user_id"],
				"where":{
					"req_receiver_user_id": req.session.auth.user_id,
					"req_status": "false"
				}
				
			}
		},
		json:true
	}, function(error, response, body){
			if(response.statusCode === 200){
				res.status(200).send(response.body);
			} else{
				console.log(response.body);
				res.status(response.statusCode).send(response.body);
			}
		});
})

app.post('/reqNameOfWaiting', function (req, res) {
	
	var request = require('request');
	request.post({
		url: "http://data.c100.hasura.me/v1/query",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+req.session.auth.token
		},
		body: {
			"type": "select",
			"args": {
				"table": "request",
				"columns": ["req_receiver_user_id"],
				"where":{
					"$or": [{"req_send_user_id": req.session.auth.user_id},
					{"req_receiver_user_id": req.session.auth.user_id}],
					"req_status": "false"
				}
				
			}
		},
		json:true
	}, function(error, response, body){
			if(response.statusCode === 200){
				res.status(200).send(response.body);
			} else{
				console.log(response.body);
				res.status(response.statusCode).send(response.body);
			}
		});
})


