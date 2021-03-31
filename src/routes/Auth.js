const router = require('express').Router();
const { login } = require('../services/AuthService');

function getAuthRoutes() {
    router.post('/auth', auth)
    return router;
}
async function auth(req, res){
    try {
        const token=await login(req.body);
        res.status(200).json(token);
    } catch (e) {
        res.status(401).send(e.message);
    }
}

exports.getAuthRoutes = getAuthRoutes;