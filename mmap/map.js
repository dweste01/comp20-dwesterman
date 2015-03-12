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
var me_test = new google.maps.LatLng(my_lat, my_lon);
var me = new google.maps.LatLng(my_lat, my_lon);
var myOptions = {
	zoom: 13,
	center: me_test,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var places;
var name = "MatthewMcAda";



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
			my_lat = position.coords.latitude;
			my_lon = position.coords.longitude;
			myOptions = {
				zoom: 13,
				center: me,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			renderMap();
		});
	} else {
		alert("Geolocation is not supported by this browser.");
	}
	console.log("Leaving getMyLocation()");
}

function renderMap() {
	console.log("in renderMap()");
	me = new google.maps.LatLng(my_lat, my_lon);
	console.log(my_lat);
	console.log(my_lon);

	console.log ("before panto me");
	map.panTo(me);
	console.log("after panto me");

	// create marker
    var img = 'liz.jpg';
	marker = new google.maps.Marker({
		position: me,
		title: "MatthewMcAda",
        icon: img
	});

	console.log("created marker");

	marker.setMap(map);

	// open info window when you click on the marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

	console.log("done with renderMap()");

    // send location info to datastore API
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200) {
            alert("Got places back!");
            data = JSON.parse(request.responseText);
            console.log(data);
            for (i = 0; i < data.lenght; i++) {
                createMarker(results[i]);
            }

        }
    };
    request.open("POST", "https://secret-about-box.herokuapp.com/sendLocation", true);
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    request.send("login=" + name + "&lat=" + my_lat + "&lng=" + my_lon);

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


// function callback()
// {
// 	// if (status == google.maps.places.PlacesServiceStatus.OK) {
// 		alert("Got places back!");
// 		places = results;
//         console.log(status);
//         console.log(results);

// 		for (var i = 0; i < results.length; i++) {
// 			createMarker(results[i]);
// 		}
// 	// }
// }







