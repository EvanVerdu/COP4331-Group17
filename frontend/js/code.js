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

	if (userId < 0) {
		window.location.href = "index.html";

	} else {
		window.location.href = "landing.html";
	}

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

function createEditBox()
{
	// Modifies the html to include a box that allows the user to edit
	// the values of a contact
	// TODO		basically just a proof of concept right now, needs functionality

	let popup = document.getElementById("popup");
	popup.innerHTML =
		'<dialog open>' +
		'<article>' +
		'<h3>Edit</h3>' +
		'<p>TODO</p>' +
		'<footer>' +
		'<button id="clearButton" onclick="removeEditBox()">Confirm</button>' +
		'</footer>' +
		'</article>' +
		'</dialog>'
	;
}

function removeEditBox()
{
	let errBox = document.getElementById("popup");
	errBox.innerHTML = "";
}

let cardCount = 0;

function addNewContact(firstName, lastName, phone, email)
{
	// Adds a new contact to the grid
	// Accepts 4 strings

	// Create id string by adding 'c' to how many cards there are
	let id = 'c'+cardCount++;

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
		'<footer>\n' +
		'<button onclick="createEditBox()">Edit</button>\n' +
		'<button onclick="removeContactCard('+id+')">Delete</button>\n' +
		'</footer>\n' +
		'</article>\n' +
		'</div>'
	;
}

function removeContactCard(id)
{
	// A function to remove a contact card from the grid
	// Called from inside the given contact card
	// TODO	This needs to also remove the card from the database!

	document.getElementById('contactList').removeChild(id);
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

