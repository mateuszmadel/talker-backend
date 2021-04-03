const router = require('express').Router();
const {createPost, createComment, getPosts} = require('../services/PostService');
const tokenAuth = require('../middlewares/tokenAuth');

function getPostRoutes() {
    router.post('/new', tokenAuth, create);
    router.post('/comment', tokenAuth, comment);
    router.get('/getall', tokenAuth, getAll);
    return router;
}
async function create(req, res){
    try {
        const post = await createPost(req.body,req.user);
        res.status(201).json(post);
    } catch (e) {
        res.status(401).send(e.message);
    }
}
async function comment(req, res){
    try {
        const comm = await createComment(req.body,req.user);
        res.status(201).json(comm);
    } catch (e) {
        res.status(401).send(e.message);
    }
}
async function getAll(req, res){
    try {
        res.status(201).json(await getPosts());
    } catch (e) {
        res.status(401).send(e.message);
    }
}


exports.getPostRoutes = getPostRoutes;