let urlBase = "http://cop4331-group17.xyz/LAMPAPI/";
let ext = ".php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	let tmp = {"login": login, "password": password};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + "Login" + ext;
	
	console.log(jsonPayload);
	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	try {
		xhr.onreadystatechange = function() {
			console.log("Yayy");
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				saveCookie();
				window.location.href = "landing.html";
			}
		};
		xhr.send(jsonPayload);
	} catch(err) {
		console.log(err);
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
		if (tokens[0] = "firstName") {
			firstName = tokens[1];
		} else if (tokens[0] = "lastName") {
			lastName = tokens[1];
		} else if (tokens[0] = "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		// send to login page
	} else {	
		console.log("Hello");
	}

}

