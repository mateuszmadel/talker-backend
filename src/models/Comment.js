const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    likes:[{ type: Schema.Types.ObjectId, ref: 'User'}],
    comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'}]
},{timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('Comment',commentSchema);

