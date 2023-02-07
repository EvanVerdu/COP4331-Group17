let urlBase = "http://cop4331-group17.xyz/LAMPAPI/";
let ext = ".php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {

	let userBox = document.getElementById("username");
	let passBox = document.getElementById("password");
	let logBttn = document.getElementById("loginButton");
	let popup = document.getElementById("popup");

	let login = userBox.value;
	let password = passBox.value;


	let tmp = {"login": login, "password": password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "Login" + ext;

	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	if (!(login === "" || password === "")) {
		logBttn.setAttribute("aria-busy", "true");
		try {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					let jsonObject = JSON.parse(xhr.responseText);
					userId = jsonObject.id;
					if (userId < 1) {
						userBox.setAttribute("aria-invalid", "true");
						passBox.setAttribute("aria-invalid", "true");
						logBttn.setAttribute("aria-busy", "false");
						errorPopup(
							popup,
							"Incorrect Username/Password!",
							"Check that the credentials you entered are correct and try again."
					);
						logBttn.setAttribute("disabled", "false");
						return;
					}
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;
					saveCookie();
					window.location.href = "landing.html";
				}
			};
			xhr.send(jsonPayload);
		} catch(err) {
			errorPopup(
				popup,
				"Uh oh, something REALLY went wrong!",
				"Something went wrong while processing your login request. Try again later."
			);
			console.log(err);
		}
	}
}

function doRegister() { 

	let firstBox = document.getElementById("firstname");
	let lastBox = document.getElementById("lastname");
	let userBox = document.getElementById("username");
	let passBox = document.getElementById("password");
	let confBox = document.getElementById("confirmPassword");
	let regBttn = document.getElementById("registerButton");
	let message = document.getElementById("message");

	let firstName = firstBox.value;
	let lastName = lastBox.value;
	let login = userBox.value;
	let password = passBox.value;
	let confpass = confBox.value;

	let tmp = {"firstName": firstName, "lastName": lastName, "login": login, "password": password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "Register" + ext;
	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);

	if (!(firstName === "" || lastName === "" || login === "" || password === "" || confpass === "")) {
		if (password.length > 20 || password.length < 8) {
			passBox.setAttribute("aria-invalid", "true");
			message.innerHTML = "*Password must be 8-20 characters.";
			regBttn.setAttribute("disabled", "false");
			return;
		}
		if (password !== confpass) {
			confBox.setAttribute("aria-invalid", "true");
			passBox.setAttribute("aria-invalid", "true");
			message.innerHTML = "*Passwords must match!";
			regBttn.setAttribute("disabled", "false");
			return;
		}


		regBttn.setAttribute("aria-busy", "true");
		try {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					let jsonObject = JSON.parse(xhr.responseText);
					userId = jsonObject.id;

					if (userId < 1) {
						userBox.setAttribute("aria-invalid", "true");
						regBttn.setAttribute("aria-busy", "false");
						message.innerHTML = "*"+jsonObject.error;
						regBttn.setAttribute("disabled", "false");
						return;
					}

					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;
					saveCookie();
					window.location.href = "landing.html";
				}
			};
			xhr.send(jsonPayload);
		} catch(err) {
			message.innerHTML = "*An unexpected error has occurred.";
		}
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function openLanding() {
	if (!readCookie()) {
		window.location.href = "index.html";
		return;
	}
	document.getElementById("welcome").innerHTML = "Welcome, " + firstName + "! Begin Searching Your Contacts..";
	loadAll();
}

function openLogin() {
	if (readCookie()) {
		window.location.href = "landing.html";
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let curr = splits[i].trim();
		let tokens = curr.split("=");
		if (tokens[0] === "firstName") {
			firstName = tokens[1];
		} else if (tokens[0] === "lastName") {
			lastName = tokens[1];
		} else if (tokens[0] === "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	return (userId >= 0);

}

function doSearch() {

	// Make sure to remove all current cards
	document.getElementById("contactList").innerHTML = "";
	
	
	let keyword = document.getElementById("search").value;

	let tmp = {"userID" : userId, "search" : keyword};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "Search" + ext;
	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	try {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					let jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.error !== "") {
						throw new Error(jsonObject.error);
					}
					for (let i = 0; i < jsonObject.results.length; i++) {
						let curr = jsonObject.results[i];
						fullName = curr.Name;
						phone = curr.Phone;
						email = curr.Email;
						id = curr.Id;
						createContactCard(fullName, phone, email, id);
					}
				}
			};
			xhr.send(jsonPayload);
	} catch(err) {
		errorPopup(
			popup,
			"Uh oh, something REALLY went wrong!",
			"Something went wrong while processing your request. Try again later."
		);
		console.log(err);
	}
}

function doDelete(id) {
	let tmp = {"id" : id};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "Delete" + ext;
	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	try {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					let jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.status === "fail") {
						throw new Error(jsonObject.error );
					}else{
						removeContactCard(id);
						closePopup();
					}
				}
			};
			xhr.send(jsonPayload);
	} catch(err) {
		errorPopup(
			popup,
			"Uh oh, something REALLY went wrong!",
			"Something went wrong while processing your request. Try again later."
		);
		console.log(err);
		return;
	}
}

function doEdit(id)
{
	// TODO Link with API!
	let name = document.getElementById("edit-name").value;
	let phone = document.getElementById("edit-phone").value;
	let email = document.getElementById("edit-email").value;
	if (name === "" || phone === "" || email === "") {
			return;
	}

	let tmp = {"id": id,"name": name, "phone": phone, "email" : email};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "Update" + ext;
	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	try {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					let jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.error != "") {
						throw new Error(jsonObject.error);
					}else{
						updateContactCard(jsonObject);
						closePopup();
					}
				}
			};
			xhr.send(jsonPayload);
	} catch(err) {
		errorPopup(
			popup,
			"Uh oh, something REALLY went wrong!",
			"Something went wrong while processing your request. Try again later."
		);
		console.log(err);
		return;
	}
}

function doCreate()
{
	// TODO Link with API!
	let name = document.getElementById("name").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;
	if (firstName === "" || lastName === "" || phone === "" || email === "") {
			return;
	}
	id = 0;
	let tmp = {"name": name, "phone": phone, "email" : email, "userId" : userId};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "Create" + ext;
	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	try {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					let jsonObject = JSON.parse(xhr.responseText);
					id = jsonObject.id;
					if (jsonObject.error !== "") {
						throw new Error(jsonObject.error);
					}
					closePopup();
					createContactCard(jsonObject.name, jsonObject.phone, jsonObject.email, jsonObject.id);
				}
			};
			xhr.send(jsonPayload);
	} catch(err) {
		errorPopup(
			popup,
			"Uh oh, something REALLY went wrong!",
			"Something went wrong while processing your request. Try again later."
		);
		console.log(err);
		return;
	}
}

function loadAll(){
	let tmp = {"userID" : userId, "search" : ""};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "Search" + ext;
	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	try {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					let jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.error !== "") {
						throw new Error(jsonObject.error);
					}
					for (let i = 0; i < jsonObject.results.length; i++) {
						let curr = jsonObject.results[i];
						fullName = curr.Name;
						phone = curr.Phone;
						email = curr.Email;
						id = curr.Id;
						createContactCard(fullName, phone, email, id);
					}
				}
			};
			xhr.send(jsonPayload);
	} catch(err) {
		errorPopup(
			popup,
			"Uh oh, something REALLY went wrong!",
			"Something went wrong while processing your request. Try again later."
		);
		console.log(err);
	}
}

function createContactCard(name, phone, email, id)
{
	// Adds a new contact to the grid
	// Accepts 4 strings

	// Create id string by adding 'c' to how many cards there are

	// Add to html
	console.log(id);
	let contactList = document.getElementById("contactList");
	contactList.innerHTML +=
		'<div class="col-xl-3 col-md-6 col-sm-12">\n' +
		'<article>\n' +
		'<hgroup id="'+id+'">\n' +
		'<h1 id="name">'+name+'</h1>\n'+
		'<span id="phone">'+phone+'</span><br>\n' +
		'<span id="email">'+email+'</span>\n' +
		'</hgroup>\n' +
		'<footer class="contact-box-footer">\n' +
		'<button class="contrast outline" onclick="editPopup('+"'"+id+"'"+')">Edit</button>' +
		'<button onclick="deletePopup('+"'"+id+"'"+')">Delete</button>' +
		'</footer>\n' +
		'</article>\n' +
		'</div>'
	;
}

//Still needs to be finished
function removeContactCard(id)
{
	// A function to remove a contact card from the grid
	// Called from inside the given contact card
	document.getElementById(id).parentElement.parentElement.remove();
}

function errorPopup(popup, errorTitle, errorMessage)
{
	// Creating a little nice popup to tell the silly user that they screwed it all up.
	popup.innerHTML =
		'<dialog open>' +
		'<article>' +
		'<h3>'+errorTitle+'</h3>' +
		'<span>'+errorMessage+'</span>' +
		'<footer>' +
		'<button id="clearButton" onclick="closePopup()">Understood</button>' +
		'</footer>' +
		'</article>' +
		'</dialog>'
	;
}

function createPopup()
{
	// Modifies the html to include a box that allows the user to edit
	// the values of a contact
	// TODO		basically just a proof of concept right now, needs functionality

	let popup = document.getElementById("popup");
	popup.innerHTML =
		'<dialog open>' +
		'<article>' +
		'<h3>Create</h3>' +
		'<label htmlFor="name">' +
		'First name' +
		'<input type="text" id="name" name="name" placeholder="Name" required>' +
		'</label>' +
		'<label htmlFor="phone">' +
		'Phone' +
		'<input type="text" id="phone" name="phone" placeholder="Phone" required>' +
		'</label>' +
		'<label htmlFor="email">' +
		'Email' +
		'<input type="text" id="email" name="email" placeholder="Email" required>' +
		'</label>' +
		'<footer style="display:flex">' +
		'<button style="margin-right:15px;" class="contrast outline" onclick="closePopup()">Cancel</button>' +
		'<button style="margin-right:15px;" onclick="doCreate('+"'"+id+"'"+')">Create</button>' +
		'</footer>' +
		'</article>' +
		'</dialog>'
	;
}

function editPopup(id)
{
	// Modifies the html to include a box that allows the user to edit
	// the values of a contact
	let name = document.getElementById(id).childNodes['1'].innerHTML;
	let phone = document.getElementById(id).childNodes['3'].innerHTML;
	let email = document.getElementById(id).childNodes['6'].innerHTML;

	let popup = document.getElementById("popup");
	popup.innerHTML =
		'<dialog open>' +
			'<article>' +
				'<h3>Edit</h3>' +
				'<label htmlFor="name">' +
					'Name' +
					'<input type="text" id="edit-name" name="name" placeholder="Name" value='+'"'+name+'"'+' required>' +
				'</label>' +
				'<label htmlFor="phone">' +
					'Phone' +
					'<input type="text" id="edit-phone" name="phone" placeholder="Phone" value='+'"'+phone+'"'+' required>' +
				'</label>' +
				'<label htmlFor="email">' +
					'Email' +
					'<input type="text" id="edit-email" name="email" placeholder="Email" value='+'"'+email+'"'+' required>' +
				'</label>' +
				'<footer style="display:flex">' +
					'<button style="margin-right:15px;" class="contrast outline" onclick="closePopup()">Cancel</button>' +
					'<button style="margin-right:15px;" onclick="doEdit('+"'"+id+"'"+')">Edit</button>' +
				'</footer>' +
			'</article>' +
		'</dialog>'
	;
}

function deletePopup(id)
{
	// Modifies the html to include a box that allows the user to edit
	// the values of a contact
	let name = document.getElementById(id).childNodes['1'].innerHTML;
	let phone = document.getElementById(id).childNodes['3'].innerHTML;
	let email = document.getElementById(id).childNodes['6'].innerHTML;

	let popup = document.getElementById("popup");
	popup.innerHTML =
		'<dialog open>' +
			'<article>' +
				'<div style="font-size:1.25rem;">Delete <span style="font-weight:bold;">'+name+'</span> from your contact list?</div><br>' +
				'<div>'+
				'<span>Name: '+name+'</span><br>'+
				'<span>Phone: '+phone+'</span><br>'+
				'<span>Email: '+email+'</span><br>'+
				'</div>'+
				'<footer style="display:flex">' +
					'<button style="margin-right:15px;" class="contrast outline" onclick="closePopup()">Cancel</button>' +
					'<button style="margin-right:15px;" onclick="doDelete('+"'"+id+"'"+')">Delete</button>' +
				'</footer>' +
			'</article>' +
		'</dialog>'
	;
}

function closePopup()
{
	let popup = document.getElementById("popup");
	popup.innerHTML = "";
}

function updateContactCard(resp) {
	document.getElementById("'"+resp.id+"'").childNodes['1'].innerHTML = resp.name;
	document.getElementById("'"+resp.id+"'").childNodes['3'].innerHTML = resp.phone;;
	document.getElementById("'"+resp.id+"'").childNodes['6'].innerHTML = resp.email;
}

function errorCheckLogin() {
	document.getElementById("username").removeAttribute("aria-invalid", "false");
	document.getElementById("password").removeAttribute("aria-invalid", "false");
	document.getElementById("message").innerHTML = "";
	document.getElementById("loginButton").removeAttribute("disabled", "false");
}

function errorCheckRegister() {
	document.getElementById("username").removeAttribute("aria-invalid", "false");
	document.getElementById("confirmPassword").removeAttribute("aria-invalid", "false");
	document.getElementById("password").removeAttribute("aria-invalid", "false");
	document.getElementById("registerButton").removeAttribute("disabled", "false");
	document.getElementById("message").innerHTML = "";
}


