const bcrypt = require('bcrypt');
const user = require('../models/User');

async function createUser(userDto){
            const salt = await bcrypt.genSalt();
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userDto.email)))
                throw new Error('Invalid email.');
            if(await user.findOne({ username:userDto.username }))
                throw new Error('User already exists.');
            if(await user.findOne({ email:userDto.email}))
                throw new Error('User with this email already exists.');
            const userRecord = await user.create({
                ...userDto,
                password: await bcrypt.hash(userDto.password, salt)
            });

            if (!userRecord) {
                throw new Error('Invalid data');
            }
            return userRecord.toObject();
}

exports.createUser=createUser;