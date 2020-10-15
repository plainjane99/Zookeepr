// this file is charge of all html routes

// ========================== imports start here ========================== //
// start an instance of router
const router = require('express').Router();
const path = require('path');
// ========================== imports end here ========================== //

// this get route responds with an html page to display in the browser
// the "/" route represents the root route
router.get('/', (req, res) => {
    // path module ensures we're finding the correct location for the html code we want to display in the browser
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// does not include "api" in the route
// this is intentional.  this more "normal-looking" endpoint should indicate we are serving up html page
// this route is for the animal page
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// this route is for the zookeeper page
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

module.exports = router;