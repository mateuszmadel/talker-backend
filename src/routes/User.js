const router = require('express').Router();
const {createUser, getUser, searchUser, getUserById, followUser, unfollowUser} = require('../services/UserService');
const tokenAuth = require('../middlewares/tokenAuth');

function getUserRoutes() {
    router.post('/register', register);
    router.get('/', tokenAuth, getUserData);
    router.get('/:userId', tokenAuth, getById);
    router.post('/search', tokenAuth, search);
    router.post('/:userId/follow', tokenAuth, follow);
    router.post('/:userId/unfollow', tokenAuth, unfollow);
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
async function getById(req,res){
    try {
        const user = await getUserById(req.params.userId);
        res.status(201).json(user);
    } catch (e) {
        res.status(401).json(e.message);
    }
}
async function search(req, res) {
    try {
        const users = await searchUser(req.body.value);
        res.status(200).json(users);
    } catch (e) {
        res.status(401).json(e.message);
    }
}

async function follow(req,res){
    try {
        const follows = await followUser(req.params.userId,req.user.username);
        res.status(201).json(follows);
    } catch (e) {
        res.status(404).json(e.message);
    }
}

async function unfollow(req,res){
    try {
        const follows = await unfollowUser(req.params.userId,req.user.username);
        res.status(201).json(follows);
    } catch (e) {
        res.status(404).json(e.message);
    }
}
exports.getUserRoutes = getUserRoutes;
