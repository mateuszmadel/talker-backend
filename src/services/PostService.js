const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const {uploadImage} = require('../utils/uploadImage');

async function createPost(body, {username}, files) {
    const author = await User.findOne({username}, '_id');
    const file = Object.values(files);
    let image;

    if (file.length > 0)
        image = await uploadImage(file[0].path);

    const postRecord = await Post.create({
        author,
        content: body.content,
        image: image
    })
    return postRecord;

}

async function createComment(body, {username}) {
    const author = await User.findOne({username}, '_id');
    const commentRecord = (await Comment.create({
        author,
        content: body.content
    })).toObject();
    commentRecord.author.username = username;
    if (body.type === 'post') {
        Post.findByIdAndUpdate(
            body.id,
            {$push: {"comments": commentRecord._id}},
            {safe: true, upsert: true, new: true},
            function (err, model) {
            }
        );
    } else {

        Comment.findByIdAndUpdate(
            body.id,
            {$push: {"comments": commentRecord._id}},
            {safe: true, upsert: true, new: true},
            function (err, model) {
            }
        )
    }
    return commentRecord;
}

async function saveLike(body, {username}) {
    const likedDocument = body.type === 'post' ? await Post.findById(body.id) : await Comment.findById(body.id);
    const likedBy = await User.findOne({username}, '_id');
    if (likedDocument.likes.includes(likedBy._id)) {
        throw new Error('Already liked');
    }
    likedDocument.likes.push(likedBy);
    likedDocument.save();
    return likedDocument.likes;
}

async function deleteLike(body, {username}) {
    const likedDocument = body.type === 'post' ? await Post.findById(body.id) : await Comment.findById(body.id);
    const likedBy = await User.findOne({username}, '_id');
    if (!likedDocument.likes.includes(likedBy._id)) {
        throw new Error('Document is not liked');
    }
    likedDocument.likes.pull(likedBy._id);
    likedDocument.save();
    return likedDocument.likes;
}

async function getPosts() {
    const posts = await Post.find({}).sort({created_at: 'desc'}).populate([{
        path: 'comments',
        populate: [{
            path: 'comments',
            populate: [{path: 'comments', populate: {path: 'author'}}, {path: 'author'}]
        }, {path: 'author'}]
    }, {path: 'author'}])
    return posts;
}

exports.createPost = createPost;
exports.createComment = createComment;
exports.getPosts = getPosts;
exports.saveLike = saveLike;
exports.deleteLike = deleteLike;
