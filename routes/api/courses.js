const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const Course = require('../../models/Course');
const multerFunc = require('../../middleware/multer');
const multerUploads = multerFunc.multerUploads;
const dataUri = multerFunc.dataUri;
const cloudinary = require('../../config/cloudinaryConfig');
const uploader = cloudinary.uploader;
const cloudinaryConfig = cloudinary.cloudinaryConfig;

//@route   GET api/courses/all
//@desc    Test route
//@access  Private
router.get('/all', async (req, res) => {
	try {
		const courses = await Course.find();
		res.json(courses);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

router.get('/one', async (req, res) => {
	const { name } = req.body;
	try {
		const course = await Course.find({name});
		res.json(course);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
