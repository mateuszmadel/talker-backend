const router = require('express').Router();
const {getAuthRoutes} = require("./Auth");
const {getUserRoutes} = require("./User");
const {getPostRoutes} = require("./Post")

function getRoutes() {
    router.use('/', getAuthRoutes());
    router.use('/user', getUserRoutes());
    router.use('/post', getPostRoutes())
    return router;
}

exports.getRoutes = getRoutes;
