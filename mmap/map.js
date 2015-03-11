// send location info to https://secret-about-box.herokuapp.com/sendLocation
// and retrieve everyone else's info there too 
// takes in three parameters: login (MatthewMcAda), lat, and long
// "login=YOURLOGIN&lat=YOUR_LATITUDE&lng=YOUR_LONGITUDE"
// 	^^ with double quotes
// 	^^ used as parameter to send info via xhr.send()

// xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// 	^^ add this parameter to the HTTP request header when exeucting
// 	HTTP POST using XMLHttpRequest

var my_lat = 0;
var my_lon = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(my_lat, my_lon);
var myOptions = {
	zoom: 13,
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var places;



// send location info to https://secret-about-box.herokuapp.com/sendLocation
// and retrieve everyone else's info there too
function init() {

	map = new google.maps.Map(document.getElementById('map-canvas'),
            myOptions);
	getMyLocation();
	console.log("Call after getMyLocation()");

}

function getMyLocation() {
	console.log("In getMyLocation()");
	if (navigator.geolocation) { // if it's supported
		navigator.geolocation.getCurrentPosition(function(position) {
			my_lat = position.coords.latitute;
			my_lon = position.coords.longitude;
			// elem = document.getElementById("info");
			// elem.innerHTML = "<h1>You are in " + my_lat + ", " + my_lon + "</h1>";

			// myLocation = new google.maps.LatLng(my_lat, my_lon);
			// // center map on my location
			// map.panTo(myLocation);
			// me = new google.map.Marker({
			// 	position : myLocation,
			// 	map : map,
			// 	title : "MatthewMcAda"
			// })
			renderMap();
		});
	} else {
		alert("Geolocation is not supported by this browser.");
	}
	console.log("Leaving getMyLocation()");
}

function renderMap(){
	console.log("in renderMap()");
	me = new google.maps.LatLng(my_lat, my_lon);

	console.log ("before panto me");

	map.panTo(me);

	console.log("after panto me");
	// create marker
	marker = new google.maps.Marker({
		position: me,
		title: "Here I am! MatthewMcAda"
	});

	console.log("created marker");

	marker.setMap(map);

	// open info window when you click on the marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

	// call google places API
	// idk what this is doing
	var request = {
		location: me,
		radius: '500',
		types: ['food']
	};

	service = new google.maps.places.PlacesService(map);
	service.search(request, callback);
	console.log("done with renderMap()");

}


function callback(results, status)
{
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		alert("Got places back!");
		places = results;
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.close();
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});

}



