const router = require('express').Router();

const {getAuthRoutes} =require("./Auth");
const {getUserRoutes}=require("./User");

function getRoutes() {
    router.use('/', getAuthRoutes());
    router.use('/user', getUserRoutes());
    return router;
}

exports.getRoutes=getRoutes;