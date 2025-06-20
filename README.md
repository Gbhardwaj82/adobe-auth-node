**OAuth 2.0 Example: Node.js**


This sample app will show you how to implement Adobe OAuth 2.0 using Node.js.

After setting up the sample, you will have a Node.js app that:

Runs on https://localhost:8000
Lets a user log in with their Adobe ID
Prompts the user to authorize the app with requested scopes
Lets the user view their Adobe ID profile information
Lets the user log out

**Contents**
GitHub
Technology Used
Prerequisites
Configuration
Create an OpenSSL cert
Install Node.js packages
Enter your Adobe API credentials
Usage
Other Resources
GitHub
You can find a companion repo for this developer guide on GitHub.

Be sure to follow all instructions in the readme.

**Technology Used**
Node.js and the npm package manager
OpenSSL CLI
Prerequisites
This guide will assume that you have read the Adobe OAuth 2.0 Guide for Web.

You must also have a registered app on the Adobe Developer Console with the following settings:

**Platform: web**
Default redirect URI: https://localhost:8000
Redirect URI Pattern: https://localhost:8000
Configuration
The following steps will help you get this sample up and running.

**Create an OpenSSL cert**
Adobe OAuth 2.0 requires SSL, so you will need to create a self-signed cert using the OpenSSL CLI. Be sure to run this in the ./server directory:

$ cd server
$ openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
Make sure that after running this command you have the cert.pem and key.pem files at the top level of the .server directory.

**Install Node.js packages**
The package.json file contains a list of dependencies. Run the following command from the top level directory of the app to install these dependencies:

$ cd ..
$ npm install
Enter your Adobe API credentials
Enter the required credentials in public/config.js:

const adobeApiKey = "YOUR_API_KEY";
const adobeApiSecret = "YOUR_API_SECRET";

try {
  if (module) {
    module.exports = {
      adobeApiKey: adobeApiKey,
      adobeApiSecret: adobeApiSecret,
    }
  }
}
catch (err) {}
You can get your Adobe API Key and Secret from your registered app page on the Adobe Developer Console.

**Usage**
After completing the configuration steps, start the server:

$ npm start
To access the app, go to https://localhost:8000. Click through any cert warnings in the browser.

Other Resources
Adobe OAuth 2.0 Guide for Web
