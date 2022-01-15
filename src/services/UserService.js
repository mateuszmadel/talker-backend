const bcrypt = require('bcrypt');
const user = require('../models/User');

async function createUser(userDto){
    const salt = await bcrypt.genSalt();
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userDto.email)))
        throw new Error('Invalid email.');
    if(await user.findOne({ username:userDto.username })) {
        throw new Error('User already exists.');
    }
    if(await user.findOne({ email:userDto.email})) {
        throw new Error('User with this email already exists.');
    }
    const userRecord = await user.create({
        ...userDto,
        password: await bcrypt.hash(userDto.password, salt)
    });

    if (!userRecord) {
        throw new Error('Invalid data');
    }
    return userRecord;
}

async function getUser({username}){
    const userRecord = await user.findOne({ username });
    const {password,__v, ...userData} = userRecord._doc;
    return userData;
}

async function searchUser(username){
    const userRecords = await user.find({ username: { $regex: new RegExp('^'+username), $options: "i" }})
    return userRecords.map(user=>{
        return {
            username:user.username,
            _id:user._id
        }
    });
}

async function getUserById(userId){
    const userRecord = await user.findOne({ _id:userId });
    const {password,__v, ...userData} = userRecord._doc;
    return userData;
}

async function followUser(userId,username){
    const userRecord = await user.findById(userId)
    const followedBy = await user.findOne({username}, '_id');
    if (userRecord.followers.includes(followedBy._id)) {
        throw new Error('Already following');
    }
    userRecord.followers.push(followedBy._id);
    userRecord.save();
    return userRecord.followers;
}

async function unfollowUser(userId,username){
    const userRecord = await user.findById(userId)
    const followedBy = await user.findOne({username}, '_id');
    if (!userRecord.followers.includes(followedBy._id)) {
        throw new Error('Not following');
    }
    userRecord.followers.pull(followedBy._id);
    userRecord.save();
    return userRecord.followers;

}

exports.unfollowUser = unfollowUser;
exports.followUser = followUser;
exports.getUserById = getUserById;
exports.searchUser = searchUser
exports.createUser = createUser;
exports.getUser = getUser;
