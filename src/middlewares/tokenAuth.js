const jwt = require('jsonwebtoken');

module.exports=function(req,res,next){
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).send('Unauthorized')
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }catch(e){
        res.status(401).send('Unauthorized');
    }
}