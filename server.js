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

// used by first route
// creates a function that takes in a query and an array of strings as an argument
// and filters through the animals accordingly
// returning a new filtered array
function filterByQuery(query, animalsArray) {

    // sets up an empty array for the personality traits because the data comes in as an array
    let personalityTraitsArray = [];

    // saves the incoming array as a new variable
    let filteredResults = animalsArray;

    // handles the properties data that came in as an array
    // this code specifically filters all animals with a specific personality trait into an array
    if (query.personalityTraits) {
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } 
        // else place the existing array into a new array
        else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    // handles the properties data that came in as a string
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

// used by second route
// takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// function that accepts the POST route's req.body value and 
// the array we want to add the data to. 
// In this case, that array will be the animalsArray, because 
// the function is for adding a new animal to the catalog.
function createNewAnimal(body, animalsArray) {
    const animal = body;
    // saves the data to the array so that it can be written
    animalsArray.push(animal);

    // fs.writeFileSync is the synchronous version of fs.writeFile
    // use the fs library to write that data to the json file
    fs.writeFileSync(
        // we want to write to our animals.json file in the data subdirectory, so 
        // we use the method path.join() to join the value of __dirname, which 
        // represents the directory of the file we execute the code in, with 
        // the path to the animals.json file.
        path.join(__dirname, './data/animals.json'),
        // save the javascript array data as json
        // null argument means we don't want to edit any of our existing data
        // "2" indicates we want to create white space between our values to make it readable
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
  
    // return finished code to post route for response
    return animal;
}

// validate that each key exists and that data is the right type
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
}

// When we make any type of request to the server, 
// Express.js will go through a couple of different phases. 
// First, it'll take the URL we made a request to and 
// check to see if it's one of the URL endpoints we've defined. 
// Once it finds a matching route, it then checks to see the method of the request and 
// determines which callback function to execute.

// first route
// use the get() method to create a route that the front-end can request data from
// get() requires two arguments
// 1. string that describes the route (address) the client will have to fetch from
// 2. callback function that will execute every time that route is accessed with get
// in simple terms, you are creating a URL on a local host
app.get('/api/animals', (req, res) => {

    // the res (short for response) callback uses the send() method to send back data
    // in simple terms, once the host is accessed, it responds with a message
    // res.send('Hello!');

    // once the host is accessed, the res callback sends back json data
    // in this case the animal const which points to the animals.json file
    // res.json(animals);
    // in simple terms, we have a URL accessing data on the local drive,
    // or eventually, a server

    // this sets up the functionality to filter results from data by 
    // calling a filter function
    // and passing in the query property on the req object
    let results = animals;
    // the query property allows us to turn the query search parameter in a URL into JSON
    if (req.query) {
        // passes req.query into the filterByQuery function
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});

// second route
// when multiple routes are required, a param route must come after the other GET route
// handles specify one animal rather than an array of all animals that match a query
// use the req.params property which is defined in the route path
// passes the parameters in a new function
// it will return a single animal, because the id is unique.
// We also know that there won't be any query on a single animal,
// so there's no need for all of the other code.
app.get('/api/animals/:id', (req, res) => {

    const result = findById(req.params.id, animals);

    // response is a single object instead of an array
    if (result) {
        res.json(result);
    } 
    // if no record exists for the animal being searched for,
    // the client receives a 404 error
    else {
        res.send(404);
    }
});

// create an API endpoint that allows a user to add new animals to the JSON file
// storing all of our data
// set up a route on our server that accepts data to be used or stored server-side
// post is another method of the app object that allows us to create routes
// we defined a route that listens for POST requests, not GET requests
// GET requests represent the action of a client requesting the server to accept data
// rather than vice versa
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    // POST requests, we can package up data, typically as an object, and send it to the server
    // req.body property is where we can access that data on the server side and do something with it
    // set id based on what the next index of the array will be
    // allows client to add data with a new id
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        // line res.status().send(); is a response method to relay a message to the client making the request
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        // sends the data back to the client.
        res.json(animal);
    }
});

// 2. this is where we have our app listening
// we will chain the express.js method called listen() onto app
// this creates a server that listens on port 3001
// when port 3001 gets accessed, it responds back
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});