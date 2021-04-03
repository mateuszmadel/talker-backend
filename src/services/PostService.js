const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

async function createPost(body,{username}){
    const author = await User.findOne({ username },'_id');
    const postRecord =await Post.create( {
        author,
        content:body.content
    })

    return postRecord.toObject();
}
async function createComment(body,{username}){
    const author = await User.findOne({ username },'_id');
    const commentRecord =(await Comment.create({
        author,
        content: body.content
    })).toObject();

    if(body.type ==='post'){
        Post.findByIdAndUpdate(
            body.id,
            {$push: {"comments": commentRecord._id }},
            {safe: true, upsert: true, new : true}
        );
    }
    else{

        Comment.findByIdAndUpdate(
            body.id,
            {$push: {"comments": commentRecord._id }},
            {safe: true, upsert: true, new : true},
            function(err, model) {
            }
        )
    }
    return commentRecord;
}
async function getPosts(){
    const posts =await Post.find({}).populate({
        path: 'comments',
        populate: { path: 'comments' }
    });
    return posts;
}
exports.createPost = createPost;
exports.createComment = createComment;
exports.getPosts = getPosts;