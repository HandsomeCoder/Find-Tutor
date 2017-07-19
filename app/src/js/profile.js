function edit(x){
		var editForm = {
		basicInfo: `<form id="editBasicInfoForm" onsubmit="save('basicInfo')" method="post" action="javascript:void(0)">
					<div id="infoHeader">
						<p> Edit Basic Information</p>
						<button id="submit" type="submit"> Save </button>
					</div>
					<div id="content">
						<table id="editContent">
								<tr>
									<td>
										<input type="text" name="username" id="username" placeholder="Username" disabled>
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" name="firstname" id="firstname" pattern="^[a-zA-Z]*$" title="Only alphabets are allowed" placeholder="First name" required>
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" name="lastname" id="lastname" pattern="^[a-zA-Z]*$" title="Only alphabets are allowed" placeholder="Last name" required>
									</td>
								</tr>
								<tr>
									<td>
										<select name="gender" id="gender" required>
											<option value=""> Select gender </option> 
											<option value="Male"> Male </option>
											<option value="Female"> Female </option>
											<option value="Other"> Not define </option>
										</select>
									</td>
								</tr>
						</table>
					</div>

		</form>
	`,
	contact: `
				<form id="editLocation" method="post" onsubmit="save('contact')" action="javascript:void(0)">
					<div id="infoHeader">
						<p> Edit Location</p>
						<button type="submit" id="submit" > Save </button>
					</div>
					<div id="content">
						<table id="editContent">
								<tr>
									<td>
										<input type="email" name="email_id" id="email_id" placeholder="Email ID" required> 
									</td>
								</tr>
								<tr>
									<td>
										<input type="number" name="mobile" id="mobile" pattern="[0-9]{10,}" title="Only numbers of length 10 is allowed" placeholder="Mobile Number" required>
									</td>
								</tr>
						</table>
					</div>

				</form>	
	`,
	location: `
				<form id="editLocation" method="post" onsubmit="save('location')" action="javascript:void(0)">
					<div id="infoHeader">
						<p> Edit Location</p>
						<button type="submit" id="submit" > Save </button>
					</div>
					<div id="content">
						<table id="editContent">
								<tr>
									<td>
										<input type="text" name="country" id="country" pattern="^[a-zA-Z]*$" title="Only alphabets are allowed" placeholder="Country" required> 
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" name="state" id="state" pattern="^[a-zA-Z]*$" title="Only alphabets are allowed" placeholder="State" required>
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" name="city" id="city" pattern="^[a-zA-Z]*$" title="Only alphabets are allowed" placeholder="City" required>
									</td>
								</tr>
						</table>
					</div>

				</form>
	`,
	education: `
				<form id="editEducation" method="post" onsubmit="save('education')" action="javascript:void(0)">
					<div id="infoHeader">
						<p> Edit Education</p>
						<button type="submit" id="submit" > Save </button>
					</div>
					<div id="content">
						<table id="editContent">
								<tr>
									<td>
										<input type="number" name="currentStd" id="currentStd" min="1" max="12" placeholder="10" required> 
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" name="board" id="board" pattern="^[a-zA-Z]*$" title="Only alphabets are allowed" placeholder="Board" required>
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" name="medium" id="medium" pattern="^[a-zA-Z]*$" title="Only alphabets are allowed" placeholder="Medium" required>
									</td>
								</tr>
						</table>
					</div>

				</form>
	`,
	requirements: `	
				<form id="editBasicInfoForm" method="post" onsubmit="save('requirements')" action="javascript:void(0)">
					<div id="infoHeader">
						<p> Edit Education</p>
						<button type="submit" id="submit" > Save </button>
					</div>
					<div id="content">
						<table id="editContent">
								<tr>
									<td>
										<textarea rows="10" cols="70" id="requirements" placeholder="Your Requirements..." required></textarea>
									</td>
								</tr>
						</table>
					</div>

				</form>
		`,
	qualification: `				<form id="editQualification" onsubmit="save('qualification')" method="post" action="javascript:void(0)">
					<div id="infoHeader">
						<p> Edit Qualification</p>
						<button id="submit" type="submit" > Save </button>
					</div>
					<div id="content">
						<table id="editContent">
								<tr>
									<td>
										<input type="text" name="degree" id="degree" placeholder="Degree" required> 
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" name="college" id="college" placeholder="Recently Attended College" required>
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" name="fieldofstudy" id="fieldofstudy" placeholder="Field of Study" required>
									</td>
								</tr>
								<tr>
									<td>
										<input type="number" name="yoe" id="yoe" placeholder="3" required>
									</td>
								</tr>
						</table>
					</div>

				</form>`,
	skillset: `
				<form id="editSkillset" method="post" onsubmit="save('skillset')" action="javascript:void(0)">
					<div id="infoHeader">
						<p> Edit Skillset</p>
						<button type="submit" id="submit" > Save </button>
					</div>
					<div id="content">
						<table id="editContent">
								<tr>
									<td>
										<textarea rows="10" cols="70" id="skillset" placeholder="Your Skillset..." required></textarea>
									</td>
								</tr>
						</table>
					</div>

				</form>
	`
	};
	document.getElementById("infoSection").innerHTML = editForm[x];
}

function getInfo(x){
	
	var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				var content = request.responseText;
				document.getElementById("infoSection").innerHTML = content.toString();
            } else if (request.status === 404) {
				edit(x);
			} else {
				alert("Something went wrong, Try again")
			}
		}
	};
	request.open('POST', 'http://localhost:8080/info', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({info: x}));  
}


function getNav(){
	var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				var content = request.responseText;
				document.getElementById("navOptions").innerHTML = content.toString();
				getInfo('basicInfo');
            } else {
				window.location.assign("../");
			}
		}
	};
	request.open('POST', 'http://localhost:8080/navOption', true);
	request.send();
}

function save(x){
	var request = new XMLHttpRequest();
    var saveBtn = document.getElementById("submit");
           
    request.onreadystatechange = function () {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				saveBtn.innerHTML = 'Saved';
				getInfo(x);
			} else {
				saveBtn.innerHTML = 'Failed, Try Again';
			}
		}
	};
	
	request.open('POST', 'http://localhost:8080/userInfo', true);
	request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({table: x,data: getData(x)}));  
    saveBtn.innerHTML = 'Saving...';	
}

function getData(x){
		console.log(x);
	   switch(x) {
			case 'basicInfo': 
				return {
					firstname: document.getElementById('firstname').value,
					lastname: document.getElementById('lastname').value,
					gender: document.getElementById('gender').value
				};
				break;
				
			case 'contact':
				return {
					email_id: document.getElementById('email_id').value,
					mobile: document.getElementById('mobile').value, 
				};
				break;
				
			case 'location': 
				return {
					country: document.getElementById('country').value,
					state: document.getElementById('state').value,
					city: document.getElementById('city').value
				};
				break;
			
			case 'education': 
				return {
					current_std: document.getElementById('currentStd').value,
					board: document.getElementById('board').value,
					medium: document.getElementById('medium').value
				}
				break;
				
			case 'requirements': 
				return {
					requirement: document.getElementById('requirements').value
				};
				break;
			
			case 'qualification': 
				return {	degree: document.getElementById('degree').value,
					college: document.getElementById('college').value,
					field_of_study: document.getElementById('fieldofstudy').value,
					year_of_experience: document.getElementById('yoe').value
				};
				break;
				
			case 'skillset': 
				return {
					skillset: document.getElementById('skillset').value
				};
				break;
	}
}
