const router = require('express').Router();
const {createUser} = require('../services/UserService');

function getUserRoutes() {
    router.post('/register', register);
    return router;
}

async function register(req, res){
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (e) {
        res.status(400).send(e.message);
    }
}

exports.getUserRoutes = getUserRoutes;