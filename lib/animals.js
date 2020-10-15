// ========================== imports start here ========================== //
const fs = require("fs");
const path = require("path");
// ========================== imports end here ========================== //


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
    path.join(__dirname, '../data/animals.json'),
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

module.exports = {
  filterByQuery,
  findById,
  createNewAnimal,
  validateAnimal
};