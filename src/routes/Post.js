const router = require('express').Router();
const {createPost, createComment, getPosts, saveLike, deleteLike, getPostsByUserId} = require('../services/PostService');
const tokenAuth = require('../middlewares/tokenAuth');
const formData = require('express-form-data')

function getPostRoutes() {
    router.post('/new', tokenAuth, formData.parse(), create);
    router.post('/comment', tokenAuth, comment);
    router.get('/getall', tokenAuth, getAll);
    router.get('/getByUser/:userId', tokenAuth, getAllByUserId);
    router.post('/like', tokenAuth, like);
    router.delete('/like', tokenAuth, removeLike)
    return router;
}

async function create(req, res) {
    try {
        const post = await createPost(req.body, req.user, req.files);
        res.status(201).json(post);
    } catch (e) {
        res.status(401).send(e.message);
    }
}

async function comment(req, res) {
    try {
        const comm = await createComment(req.body, req.user);
        res.status(201).json(comm);
    } catch (e) {
        res.status(401).send(e.message);
    }
}

async function getAll(req, res) {
    try {
        const posts = await getPosts(req.user.username)
        res.status(201).json(posts);
    } catch (e) {
        res.status(404).send(e.message);
    }
}

async function like(req, res) {
    try {
        res.status(201).json(await saveLike(req.body, req.user));
    } catch (e) {
        res.status(401).send(e.message);
    }
}

async function removeLike(req, res) {
    try {
        res.status(201).json(await deleteLike(req.body, req.user));
    } catch (e) {
        res.status(401).send(e.message);
    }
}
async function getAllByUserId(req, res) {
    try {
        const userId = req.params.userId;
        res.status(201).json(await getPostsByUserId(userId));
    } catch (e) {
        res.status(401).send(e.message);
    }
}


exports.getPostRoutes = getPostRoutes;
