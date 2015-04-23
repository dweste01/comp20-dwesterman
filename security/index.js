// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Mongo initialization and connect to database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.post('/sendLocation', function(request, response) {
	// gather inputs from request body
	var login = request.body.login;
	var lat   = parseFloat(request.body.lat);
	var lng   = parseFloat(request.body.lng);

	// create time stamp
	var created_at = new Date().toString();

	// check if all inputs are properly defined
	if (login == undefined || lat == undefined || lng == undefined || isNaN(lat) || isNaN(lng)) {
		response.send({"error":"Whoops, something is wrong with your data!"}); 
	}

	// Create new object data to add to database
	var toInsert = {
		"login"		 : login,
		"lat"  		 : lat,
		"lng"  		 : lng,
		"created_at" : created_at
	};

	db.collection('locations', function(err1, collection) {
		// check to see if user login already has a previous entry
		collection.find({"login":login}).toArray(function(err2, cursor) {
			if (!err2) {
				// If so, remove it
				if (cursor.length > 0) {
					collection.remove({"login":login});
				}
				// Add the new entry to the database
				var id = collection.insert(toInsert, function(err3, saved) {
					if (err3) {
						response.send(500);
					}
				});
			}
		});
		// Send all location entries in the database
		collection.find().toArray(function(err2, cursor) {
			if (!err2) {
				response.set('Content-Type', 'text/html');
				response.send(JSON.stringify(cursor));
			}
		})
	});
});

app.get('/location.json', function(request, response) {
	response.set('Content-Type', 'text/html');

	// check for bad input to avoid site crashing
	if (request == undefined || request == null || 
		request.query == undefined || request.query == null) {
		response.send("{}");
	}
	var login = request.query.login;
	if (login == undefined || login == null || login == "") {
		response.send('{}');
	}

	try {
		db.collection('locations', function(err1, collection) {
			if (err1) {
				response.send('{}');
			}
			// check to see if user login already has a previous entry
			collection.find({"login":login}).toArray(function(err2, cursor) {
				if (!err2) {
					// See if login information exists, and if so, send it
					if (cursor.length > 0) {
						response.send(JSON.stringify(cursor));
					}
					// Else, send empty JSON  
					response.send('{}');
				}
			});
		});
	}
	catch (exception) {
		response.send('{}');
	}
});

app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	db.collection('locations', function(er, collection) {
		collection.find().toArray(function(err, cursor) {
			if (!err) {
				for (var count = 0; count < cursor.length; count++) {
					indexPage  = "<p>" + cursor[count].login + " checked in at "
							   + cursor[count].lat + ", " + cursor[count].lng + " on "
							   + cursor[count].created_at + "</p>" + indexPage;
				}
				indexPage = "<!DOCTYPE HTML><html><head><title>Marauder's Map Locations</title></head><body><h1>Who Checked In?</h1>" + indexPage + "</body></html>";
				response.send(indexPage);
			} else {
				response.send("<!DOCTYPE HTML><html><head><title>Marauder's Map Locations</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>");
			}
		});
	});
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);