const cloudinary = require('../Config/Cloudinary');
exports.imageUploder = async() => {
    await cloudinary.uploader.upload(req.file.path, function(err, result) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: "image upload failed",
            })
        }
        return result.secure_url;

    })
}