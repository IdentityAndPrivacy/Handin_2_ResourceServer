	// server.js

	// BASE SETUP
	// =============================================================================

	// call the packages we need
	var express    	= require('express');        // call express
	var app        	= express();                 // define our app using express
	var bodyParser 	= require('body-parser');
	var http 		= require('http');
	var querystring = require("querystring");


	var accessToken = 'ii9hD7yw8ao9ereDh34aer93db';
	var receivedAccessToken;

	// configure app to use bodyParser()
	// this will let us get the data from a POST
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	var port = process.env.PORT || 8080;        // set our port

	// ROUTES FOR OUR API
	// =============================================================================
	var router = express.Router();              // get an instance of the express Router

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
	    res.json({ message: 'Welcome to the Resource Server' }); 
	});


	// token received from client 
	router.post('/token', function(req, res) {
		// Coordination with Authoriazation server?
		receivedAccessToken = req.body.accessToken;

		var data = querystring.stringify({data: 'Some data'});
		 
		var url1 = "pi-auth-server.herokuapp.com/token-validation?token="+receivedAccessToken;
		var url = "pi-auth-server.herokuapp.com";

		var options = {
			host: url,
			port: 80,
			method: 'GET',
			path: '/token-validation?token='+receivedAccessToken,
    		headers: {
        		'Content-Type': 'application/x-www-form-urlencoded',
        		'Content-Length': Buffer.byteLength(data)
    		}
		};

		var requ = http.request(options, function(resp) {
	    	resp.setEncoding('utf8');
	    	if(resp.statusCode == '200'){
				res.json({ message: 'Access authorized',
						   data: {
						   		name: 'Bob',
						   		age: '30',
						   		gender: 'male'
						   }}); 
	    	} else {
				res.json({ message: 'Access denied!' }); 
	    	}
		});

		requ.write(data);
		requ.end();

	});

	// more routes for our API will happen here

	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api', router);

	// START THE SERVER
	// =============================================================================
	app.listen(port);
	console.log('Server runnig on port ' + port);