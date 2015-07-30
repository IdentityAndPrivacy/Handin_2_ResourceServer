// Resource server
// server.js

// BASE SETUP
// =============================================================================

// call the packages needed
var express    	= require('express');        // call express
var app        	= express();                 // define our app using express
var bodyParser 	= require('body-parser');
var https		= require('https');
var querystring = require("querystring");
var faker		= require('faker');


//var accessToken = 'ii9hD7yw8ao9ereDh34aer93db';
var receivedAccessToken;

//setup faker
faker.local = 'en_GB';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set our port
var port = process.env.PORT || 8080;        

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the Resource Server' }); 
});


// Receive token from client and verify the token at the authorization server
router.post('/token', function(req, res) {
	// Coordination with Authoriazation server?
	receivedAccessToken = req.body.accessToken;

	var data = querystring.stringify({data: 'Some data'});

	// url to the authorization server
	var url = "pi-auth-server.herokuapp.com";

	// Options for the get request to the auth. server
	var options = {
		host: url,
		method: 'GET',
		path: '/token-validation?token='+receivedAccessToken,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(data)
		}
	};

	// Make request to auth. server
	var newReq = https.request(options, function(resp) {
		resp.setEncoding('utf8');

    	// Handle response from auth. server
    	if(resp.statusCode === 200){ 
    		// Successful responce - access granted to client
    		// json response to client  
    		var jsonData = { message: 'Access authorized',
    						data: { users:{} } }

    		// gernerate fake user data
    		for(var i=0; i<20; i++){
    			var newuser = {
    				name: faker.name.findName(),
    				title: faker.name.title(),
    				address: faker.address.streetAddress(),
    				city: faker.address.city(),
    				phone: faker.phone.phoneNumber(),
    				image: faker.image.image()
    			}
    			jsonData.data.users[i] = (newuser);
    		}
    		res.json(jsonData);
    	} else {
    		// Error Handling
    		// Access denied (StatusCode = 421)
    		res.json({ message: 'Access denied!' }); 
    	}
    });

	newReq.write(data);
	newReq.end();

});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running on port ' + port);