// Your JavaScript goes here...

function parse(){

	// 1: create instance of object
	request = new XMLHttpRequest();

	// 3: set up way to managa response --to a function
	request.onreadystatechange = parseData;

	// 2: create/open HTTP request
	request.open("GET", "data.json", true);

	// 4: execute request
	request.send();

}




function parseData() {
	if (request.readyState ==4) {
		messagesDiv = document.getElementById("messages");
		converted = JSON.parse(request.responseText);
		for (i = 0; i < converted.length; i++) {
	messagesDiv.innerHTML += "<p>" + converted [i]['content'] + " " + converted [i]['username'] + "</p>";
		}

	}

}