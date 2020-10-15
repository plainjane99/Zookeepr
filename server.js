// this file is in charge of starting our server

// ========================== imports start here ========================== //

// just like any npm package, we will "require" express.js
const express = require('express');

// require the data
// but why????? and what does this have to do with the route???
const { animals } = require('./data/animals.json');

// We'll have to not only use .push() to 
// save the new data in this local server.js copy of our animal data, but 
// we'll also have to import and use the fs library to write that data to animals.json.
const fs = require('fs');
// module built into the Node.js API that provides utilities for working with file and directory paths
const path = require('path');

// The require() statements will read
// the index.js files in each of the directories indicated
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// ========================== imports end here ========================== //

// tell the app to use an environment variable called process.env.PORT
// tells the app to use that PORT, if it has been set, otherwise default to port 80
const PORT = process.env.PORT || 3001;

// Setting up the server only takes two steps: 
// 1. we need to instantiate the server, 
// 2. tell it to listen for requests. 

// 1. To instantiate the server, i.e. start express, add:
const app = express();
// we have assigned express() to app
// every time we call express(), we create a new express.js object
// changing the properties or methods on one express.js object doesn't affect others express.js objects created
// so that we can later chain on methods to the express.js server

// In order for our server to accept incoming data the way we need it to, 
// we need to tell our Express.js app to intercept our POST request before 
// it gets to the callback function. 
// At that point, the data will be run through a couple of functions to 
// take the raw data transferred over HTTP and convert it to a JSON object.
// app.use is a method executed by our Express.js server that 
// mounts a function to the server that our requests will pass through before 
// getting to the intended endpoint. 
// The functions we can mount to our server are referred to as middleware.
// parse incoming string or array data
// express.url... is an express method that takes incoming POST data and
// converts it to key/value pairings that can be accessed in the req.body object
// extended: true option informs our server that there may be sub-array data nested in it
// so it needs to look as deep into the POST data as possible
app.use(express.urlencoded({ extended: true }));
// express.json takes incoming POST data in the form of JSON and
// parses it into the req.body javascript object
// parse incoming JSON data
app.use(express.json());
// both of the above funtions need to be set up every time you create a server that's
// looking to accept POST data

// our way of telling the server that 
// any time a client navigates to <ourhost>/api, 
// the app will use the router we set up in apiRoutes. 
// If "/" is the endpoint, then the router will serve back our HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Express.js middleware that instructs the server to make certain files readily available and 
// to not gate it behind a server endpoint
// this makes all of the files in the public directory available
// by instructing the server to make these files static resources
// files in public include all html, css, js for front end
app.use(express.static('public'));

// 2. this is where we have our app listening
// we will chain the express.js method called listen() onto app
// this creates a server that listens on port 3001
// when port 3001 gets accessed, it responds back
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});