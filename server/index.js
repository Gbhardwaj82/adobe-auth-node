const express = require('express');
const app = express();
const session = require('express-session')
const request = require('request-promise');
const https = require('https');
const bodyParser = require('body-parser');
const adobeApiKey = require('../public/config.js').adobeApiKey;
const adobeApiSecret = require('../public/config.js').adobeApiSecret;
const webhookUrl = require('../public/config.js').webhookUrl;
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

/* Declare host name and port */
const hostname = 'localhost';
const port = 8000;

/* Middlewares */
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'jade')
app.use(session({
	/* Change this to your own secret value */
    secret: 'this-is-secret',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 6000000
    }
}));

/* Routes */
app.get('/', function (req, res) {
	res.render('index');
})

app.get('/login', function(req, res){
	/* This will prompt user with the Adobe auth screen */
	res.redirect(`https://ims-na1.adobelogin.com/ims/authorize?client_id=${adobeApiKey}&scope=AdobeID,ee.express_api,openid&response_type=code&redirect_uri=https://localhost:8000/callback`)
})

app.get('/callback', async function(req, res){
	console.log("Inside callback method....");
	/* Retrieve authorization code from request */
	let code = req.query.code;

	console.log("Code : ",code);
	console.log("AdobeApiKey : ",adobeApiKey);

	let responseWebhook=await sendToWebhook(adobeApiKey,code, webhookUrl);
	console.log("responseWebhook : ", responseWebhook);
	res.render('index', {'response':responseWebhook});

	/* Set options with required paramters */
	/*let requestOptions = {
        uri: `https://ims-na1.adobelogin.com/ims/token?grant_type=authorization_code&client_id=${adobeApiKey}&client_secret=${adobeApiSecret}&code=${code}`,
        method: 'POST',
        json: true
	}*/

	/* Send a POST request using the request library */
	/*request(requestOptions)
		.then(function (response) {
			
			req.session.token = response.access_token;
			res.render('index', {'response':'User logged in!'});
    	})
    	.catch(function (error) {
    		res.render('index', {'response':'Log in failed!'});
    	});*/
})

app.get('/profile', function(req, res){
	if (req.session.token) {
		/* Grab the token stored in req.session 
		and set options with required parameters */
		let requestOptions = {
	        uri: `https://ims-na1.adobelogin.com/ims/userinfo?client_id=${adobeApiKey}`,
	        headers: {
	        	Authorization: `Bearer ${req.session.token}`
	        },
	        json: true
	    };

	    /* Send a GET request using the request library */
		request(requestOptions)
			.then(function (response) {
				/* Send the received response back to the client side */
				res.render('index', {'response':JSON.stringify(response)});
	    	})
	    	.catch(function (error) {
	    		console.log(error)
	    	});

	} else {
		res.render('index', {'response':'You need to log in first'});
	}
})

/* Set up a HTTS server with the signed certification */
var httpsServer = https.createServer({
	key: fs.readFileSync(path.join(__dirname, 'key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
}, app).listen(port, hostname, (err) => {
	if (err) console.log(`Error: ${err}`);
	console.log(`listening on port ${port}!`);
});

async function sendToWebhook(key,token, hookUrl) {
  //const webhookUrl = 'https://hook.app.workfrontfusion.com/g2rpm8m59fsylx69ktjqt2cwleypxmga'; //Gaurav
 //const webhookUrl = 'https://hook.app.workfrontfusion.com/r5meqb0dibqg561rsjyvvk1msnrcf8k4'; //chetna

  const response = await fetch(hookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'completed',
      data: { AccessToken: token,
			  ApiKey :key
	   		}
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Webhook Error: ${response.status} - ${errorText}`);
  }

  return response.text();
}