const cloudinary = require("cloudinary");
const configure = cloudinary.config;
const uploader = cloudinary.uploader;
const dotenv = require("dotenv");
dotenv.config();
const cloudinaryConfig = (req, res, next) => {
	configure({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	next();
};
module.exports = { cloudinaryConfig, uploader };
