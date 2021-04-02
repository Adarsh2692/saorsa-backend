const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const Course = require("../../models/Course");
const multerFunc = require("../../middleware/multer");
const multerUploads = multerFunc.multerUploads;
const dataUri = multerFunc.dataUri;
const cloudinary = require("../../config/cloudinaryConfig");
const uploader = cloudinary.uploader;
const cloudinaryConfig = cloudinary.cloudinaryConfig;

//@route   POST api/courses/new
//@desc    Test route
//@access  Private
router.post("/new",multerUploads, async (req, res) => {
	const { courseName, musicLink, exerciseLink } = req.body;

	let courseImage = "";

	//Here we accept a file and upload it to clouinary, get a link for that and save it to db
	if (req.file) {
		const file = dataUri(req).content;
		await uploader.upload(file).then((result) => {
			courseImage = result.url;
		});
	}

	//build newCourse object
	const newCourse = {
		courseName,
		courseImage,
		musicLink,
		exerciseLink,
	};

	try {
		//add this course to database
		const latestCourse = new Course(newCourse);

		await latestCourse.save();

		res.json(latestCourse);
	} catch (err) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

//@route   GET api/courses/all
//@desc    Test route
//@access  Private
router.get("/all", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
