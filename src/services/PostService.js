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
    commentRecord.author.username=username;
    if(body.type ==='post'){
        Post.findByIdAndUpdate(
            body.id,
            {$push: {"comments": commentRecord._id }},
            {safe: true, upsert: true, new : true},
            function(err, model) {
            }
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
async function saveLike(body,{username}) {
    const likedDocument = body.type==='post'? await Post.findById(body.id):await Comment.findById(body.id);
    const likedBy = await User.findOne({username}, '_id');
    if(likedDocument.likes.includes(likedBy._id)){
        throw new Error('Already liked');
    }
    likedDocument.likes.unshift(likedBy);
    likedDocument.save();
    return likedDocument.likes;
}
async function getPosts(){
    const posts =await Post.find({}).populate([{
        path: 'comments',
        populate:[{ path: 'comments', populate:[{path: 'comments',populate:{path:'author'}},{path:'author'}] }, {path: 'author'}]
    }, {path: 'author'}])
    return posts;
}
exports.createPost = createPost;
exports.createComment = createComment;
exports.getPosts = getPosts;
exports.saveLike = saveLike;