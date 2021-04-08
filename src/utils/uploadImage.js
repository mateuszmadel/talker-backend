const cloudinary = require('cloudinary').v2

async function uploadImage(imageFile) {
    const response = await cloudinary.uploader.upload(imageFile, {tags: 'test'})
    console.log('** file uploaded to Cloudinary service');
    return response.url;
}

exports.uploadImage = uploadImage;