const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    likes:[{ type: Schema.Types.ObjectId, ref: 'Like'}],

},{timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('Post',postSchema);