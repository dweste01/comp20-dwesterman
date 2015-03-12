// Danielle Westerman
// Marauder's Map
// COMP20 Assignment 2
// 3/12/15
var my_lat = 0;
var my_lon = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(my_lat, my_lon);
var myOptions = {
	zoom: 15,
	center: me,
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
}

function getMyLocation() {
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
}

function renderMap() {

	me = new google.maps.LatLng(my_lat, my_lon);
	map.panTo(me);

	// create marker
    	var img = 'liz.jpg';
	marker = new google.maps.Marker({
		position: me,
		title: "MatthewMcAda",
        	icon: img
	});

	marker.setMap(map);

	// open info window when you click on the marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.close();
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

    	// send location info to datastore API
    	request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200) {
            data = JSON.parse(request.responseText);

            for (i = 0; i < data.length; i++) {
                createOtherMarkers(data[i]);
            }

        }
    };
    request.open("POST", "https://secret-about-box.herokuapp.com/sendLocation", true);
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    request.send("login=" + name + "&lat=" + my_lat + "&lng=" + my_lon);

}


function haversine(lat, lng){

	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}

	var R = 6371;
	var x1 = my_lat - lat;
	var dLat = x1.toRad();
	var x2 = my_lon - lng;
	var dLon = x2.toRad();
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
	                Math.cos(lat.toRad()) * Math.cos(my_lat.toRad()) * 
	                Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 
	return d;

}


function createOtherMarkers(place) {

	newloc = new google.maps.LatLng(place.lat, place.lng);

	dis = haversine(place.lat, place.lng);

	newmarker = new google.maps.Marker({
		position: newloc,
		map: map,
		title: place.login
	});

	content = '<div> <p>' + place.login + " is "
			+ Math.round(dis*100)/100 + " miles away </p> </div>" 
	newmarker.content = content;
	new_iw = new google.maps.InfoWindow();
	google.maps.event.addListener(newmarker, 'click', function() {
		new_iw.setContent(this.content);
		new_iw.open(this.getMap(), this);
		map.panTo(this.position);
	});

	newmarker.setMap(map);

}







