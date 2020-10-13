// ========================== imports start here ========================== //

// just like any npm package, we will "require" express.js
const express = require('express');

// require the data
// but why????? and what does this have to do with the route???
const { animals } = require('./data/animals.json');

// ========================== imports end here ========================== //

// Setting up the server only takes two steps: 
// 1. we need to instantiate the server, 
// 2. tell it to listen for requests. 

// 1. To instantiate the server, i.e. start express, add:
const app = express();
// we have assigned express() to app
// so that we can later chain on methods to the express.js server

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

// we will chain the express.js method called listen() onto app
// this creates a server that listens on port 3001
// when port 3001 gets accessed, it responds back
app.listen(3001, () => {
    console.log(`API server now on port 3001`);
});