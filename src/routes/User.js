const router = require('express').Router();
const {createUser, getUser} = require('../services/UserService');
const tokenAuth = require('../middlewares/tokenAuth');

function getUserRoutes() {
    router.post('/register', register);
    router.get('/', tokenAuth, getUserData);
    return router;
}

async function register(req, res) {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

async function getUserData(req, res) {
    try {
        const user = await getUser(req.user);
        res.status(201).json(user);
    } catch (e) {
        res.status(401).json(e.message);
    }
}

exports.getUserRoutes = getUserRoutes;
