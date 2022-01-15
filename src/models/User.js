const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
}, {strict: false});

module.exports = mongoose.model('User', userSchema);
