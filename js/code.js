let urlBase = "http://cop4331-group17.xyz/LAMPAPI/";
let ext = ".php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let userBox = document.getElementById("username");
	let passBox = document.getElementById("password");
	let logBttn = document.getElementById("loginButton");
	let errBox = document.getElementById("message");

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
						createErrorBox(
							errBox,
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
			createErrorBox(
				errBox,
				"Uh oh, something REALLY went wrong!",
				"Something went wrong while processing your login request. Try again later."
			);
			console.log(err);
		}
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

function doRegister() {
	userId = 0;
	firstName = "";
	lastName = "";

	let firstBox = document.getElementById("firstname");
	let lastBox = document.getElementById("lastname");
	let userBox = document.getElementById("username");
	let passBox = document.getElementById("password");
	let confBox = document.getElementById("confirmPassword");
	let regBttn = document.getElementById("registerButton");
	let errBox = document.getElementById("message");

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
			errBox.innerHTML = "Password must be 8-20 characters.";
			regBttn.setAttribute("disabled", "false");
			return;
		}
		if (password !== confpass) {
			confBox.setAttribute("aria-invalid", "true");
			passBox.setAttribute("aria-invalid", "true");
			errBox.innerHTML = "Passwords must match!";
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
						errBox.innerHTML = jsonObject.error;
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
			errBox.innerHTML = "An unexpected error has occurred.";
		}
	}
}

function createErrorBox(errBox, errorTitle, errorMessage)
{
	// Creating a little nice popup to tell the silly user that they screwed it all up.
	errBox.innerHTML =
		'<dialog open>' +
		'<article>' +
		'<h3>'+errorTitle+'</h3>' +
		'<p>'+errorMessage+'</p>' +
		'<footer>' +
		'<button id="clearButton" onclick="removeErrorBox()">Understood</button>' +
		'</footer>' +
		'</article>' +
		'</dialog>'
	;
}

function removeErrorBox()
{
	// Called by a button press inside said error box.
	let errBox = document.getElementById("message");
	errBox.innerHTML = "";
}

function createCreateBox(id)
{
	// Modifies the html to include a box that allows the user to edit
	// the values of a contact
	// TODO		basically just a proof of concept right now, needs functionality

	let popup = document.getElementById("popup");
	popup.innerHTML =
		'<dialog open>' +
		'<article>' +
		'<h3>Create</h3>' +
		'<label htmlFor="firstname">' +
		'First name' +
		'<input type="text" id="firstname" name="firstname" placeholder="First name" required>' +
		'</label>' +
		'<label htmlFor="lastname">' +
		'lastname' +
		'<input type="text" id="lastname" name="firstname" placeholder="Last name" required>' +
		'</label>' +
		'<label htmlFor="phone">' +
		'Phone' +
		'<input type="text" id="phone" name="phone" placeholder="Phone" required>' +
		'</label>' +
		'<label htmlFor="email">' +
		'Email' +
		'<input type="text" id="email" name="email" placeholder="Email" required>' +
		'</label>' +
		'<footer>' +
		'<button onclick="createContactFromPopup()">Create</button>\n' +
		'</footer>' +
		'</article>' +
		'</dialog>'
	;
}

function createEditBox(id)
{
	// Modifies the html to include a box that allows the user to edit
	// the values of a contact

	let popup = document.getElementById("popup");
	popup.innerHTML =
		'<dialog open>' +
			'<article>' +
				'<h3>Edit</h3>' +
				'<label htmlFor="firstname">' +
					'First name' +
					'<input type="text" id="firstname" name="firstname" placeholder="First name" required>' +
				'</label>' +
				'<label htmlFor="lastname">' +
					'Last name' +
					'<input type="text" id="lastname" name="lastname" placeholder="Last name" required>' +
				'</label>' +
				'<label htmlFor="phone">' +
					'Phone' +
					'<input type="text" id="phone" name="phone" placeholder="Phone" required>' +
				'</label>' +
				'<label htmlFor="email">' +
					'Phone' +
					'<input type="text" id="email" name="email" placeholder="Email" required>' +
				'</label>' +
				'<footer>' +
					'<button onclick="editContact('+id+')">Edit</button>' +
				'</footer>' +
			'</article>' +
		'</dialog>'
	;
}

function editContact(id)
{
	// TODO Link with API!
	let firstName = document.getElementById("firstname").value;
	let lastName = document.getElementById("lastname").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;
	if (firstName === "" || lastName === "" || phone === "" || email === "") {
			return;
	}

	let tmp = {"id": id,"name": firstName + " " + lastName, "phone": phone, "email" : email};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "Update" + ext;
	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	try {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					let jsonObject = JSON.parse(xhr.responseText);

					if (jsonObject.error === "") {
						throw new Error(jsonObject.error);
					}
				}
			};
			xhr.send(jsonPayload);
	} catch(err) {
		createErrorBox(
			errBox,
			"Uh oh, something REALLY went wrong!",
			"Something went wrong while processing your request. Try again later."
		);
		console.log(err);
		return;
	}
	removeContact(id);
	createContact(firstName, lastName, phone, email, id);
	removePopup();
}

function removePopup()
{
	let errBox = document.getElementById("popup");
	errBox.innerHTML = "";
}

function createContactFromPopup()
{
	// TODO Link with API!
	let firstName = document.getElementById("firstname").value;
	let lastName = document.getElementById("lastname").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;
	if (firstName === "" || lastName === "" || phone === "" || email === "") {
			return;
	}
	id = 0;
	let tmp = {"name": firstName + " " + lastName, "phone": phone, "email" : email, "userId" : userId};
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
				}
			};
			xhr.send(jsonPayload);
	} catch(err) {
		createErrorBox(
			errBox,
			"Uh oh, something REALLY went wrong!",
			"Something went wrong while processing your request. Try again later."
		);
		console.log(err);
		return;
	}

	removePopup();
	createContact(firstName, lastName, phone, email, id);
}

function createContact(firstName, lastName, phone, email, id)
{
	// Adds a new contact to the grid
	// Accepts 4 strings

	// Create id string by adding 'c' to how many cards there are

	// Add to html
	let contactList = document.getElementById("contactList");
	contactList.innerHTML +=
		'<div class="col-xl-4 col-md-6 col-sm-12" id="'+id+'">\n' +
		'<article>\n' +
		'<hgroup>\n' +
		'<h1>'+firstName+' '+lastName+'</h1>\n' +
		''+phone+'<br>\n' +
		''+email+'\n' +
		'</hgroup>\n' +
		'<footer class="contact-box-footer">\n' +
		'<button onclick="createEditBox(c'+id+')">Edit</button>' +
		'<button onclick="deleteContact(c'+id+')">Delete</button>' +
		'</footer>\n' +
		'</article>\n' +
		'</div>'
	;
}

function removeContact(id)
{
	// A function to remove a contact card from the grid
	// Called from inside the given contact card
	document.getElementById('c' + id);
}

function deleteContact(id) {
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
					}
				}
			};
			xhr.send(jsonPayload);
	} catch(err) {
		createErrorBox(
			errBox,
			"Uh oh, something REALLY went wrong!",
			"Something went wrong while processing your request. Try again later."
		);
		console.log(err);
		return;
	}
	removeContact(id);
}

function updateBox() {
	document.getElementById("username").removeAttribute("aria-invalid", "false");
	document.getElementById("password").removeAttribute("aria-invalid", "false");
	document.getElementById("message").innerHTML = "";
	document.getElementById("loginButton").removeAttribute("disabled", "false");
}

function updateBox2() {
	document.getElementById("username").removeAttribute("aria-invalid", "false");
	document.getElementById("confirmPassword").removeAttribute("aria-invalid", "false");
	document.getElementById("password").removeAttribute("aria-invalid", "false");
	document.getElementById("registerButton").removeAttribute("disabled", "false");
	document.getElementById("message").innerHTML = "";
}

function openLandingPage() {
	if (!readCookie()) {
		window.location.href = "index.html";
		return;
	}
	document.getElementById("welcome").innerHTML = "Welcome, " + firstName + ".";
	updateContactList();
}

function openLoginPage() {
	if (readCookie()) {
		window.location.href = "landing.html";
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

function updateContactList() {
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
						fullName = curr.Name.split(" ");
						first = fullName[0];
						last = fullName[1];
						phone = curr.Phone;
						email = curr.Email;
						id = curr.id;
						createContact(first, last, phone, email, id);
					}
				}
			};
			xhr.send(jsonPayload);
	} catch(err) {
		createErrorBox(
			errBox,
			"Uh oh, something REALLY went wrong!",
			"Something went wrong while processing your request. Try again later."
		);
		console.log(err);
	}
}
