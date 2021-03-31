const user = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(loginDto){
    const userRecord = await user.findOne({ username:loginDto.username });
    if (!userRecord) {
        throw new Error('Invalid login credentials');
    }

    const validPass= await bcrypt.compare(loginDto.password,userRecord.password);
    if (!validPass) {
        throw new Error('Invalid login credentials');
    }

    return jwt.sign({username:loginDto.username},process.env.JWT_SECRET);
}

exports.login = login;