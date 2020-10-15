// this file going to add middleware so that our app knows 
// about the routes in animalRoutes.js
// Doing it this way, we're using this file, apiRoutes/index.js, as a central hub
// for all routing functions we may want to add to the application

// ========================== imports start here ========================== //
const router = require('express').Router();

// Here we're employing Router as before, but 
// this time we're having it use the module exported from animalRoutes.js
const animalRoutes = require('../apiRoutes/animalRoutes');

// ========================== imports end here ========================== //

// middleware so that the router uses the new animal and zookeeper routes 
router.use(animalRoutes);
router.use(require('./zookeeperRoutes'));

module.exports = router;
