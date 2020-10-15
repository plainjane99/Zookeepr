// this file holds all of the zookeeper API routes

// ========================== imports start here ========================== //
// start an instance of router
const router = require('express').Router();

const { filterByQuery, findById, createNewZookeeper, validateZookeeper } = require('../../lib/zookeepers');
const { zookeepers } = require('../../data/zookeepers');
// ========================== imports end here ========================== //

router.get('/zookeepers', (req, res) => {
    let results = zookeepers;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

router.get('/zookeepers/:id', (req, res) => {

    const result = findById(req.params.id, zookeepers);

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

router.post('/zookeepers', (req, res) => {
    req.body.id = zookeepers.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateZookeeper(req.body)) {
        // line res.status().send(); is a response method to relay a message to the client making the request
        res.status(400).send('The zookeeper is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const zookeeper = createNewZookeeper(req.body, zookeepers);

        // sends the data back to the client.
        res.json(zookeeper);
    }
});

module.exports  = router;