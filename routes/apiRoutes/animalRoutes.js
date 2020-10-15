// this file holds all of the animals API routes

// ========================== imports start here ========================== //
// start an instance of router
const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
// ========================== imports end here ========================== //

// used by first route
// creates a function that takes in a query and an array of strings as an argument
// and filters through the animals accordingly
// returning a new filtered array

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
router.get('/animals', (req, res) => {

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
router.get('/animals/:id', (req, res) => {

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
router.post('/animals', (req, res) => {
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

module.exports  = router;