const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Step = require('../../models/Step');
const multerFunc = require('../../middleware/multer');
const multerUploads = multerFunc.multerUploads;
const dataUri = multerFunc.dataUri;
const cloudinary = require('../../config/cloudinaryConfig');
const uploader = cloudinary.uploader;
const cloudinaryConfig = cloudinary.cloudinaryConfig;

//@route    POST api/step/create
//@desc     Create a step
//@access   Admin access *for now we arent using admin auth to keep things simple
router.post('/create', multerUploads, async (req, res) => {
	const { name, title, headingText } = req.body;

	//Build step object
	const stepFields = {};
	if (name) stepFields.name = name;
	if (title) stepFields.title = title;
	if (headingText) stepFields.headingText = headingText;

	//Here we accept a file and upload it to clouinary, get a link for that and save it to db
	if (req.file) {
		const file = dataUri(req).content;
		await uploader.upload(file).then((result) => {
			stepFields.image = result.url;
		});
	}

	try {
		let step = await Step.findOne({ name: req.name });

		//Every step should have unique name, eg:Step1, Step2
		if (step) {
			return res.status(400).send('Step already exists');
		}
		const newStep = new Step(stepFields);
		newStep.save();
		res.send(newStep);
	} catch (err) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

//@route    POST api/step/:step/courses
//@desc     Add a course in given step
//@access   Admin access *for now we arent using admin auth to keep things simple
router.post('/:step/courses', multerUploads, async (req, res) => {
	const { name } = req.body;

	//Build course object
	const stepFields = {};
	stepFields.courses = {};
	if (name) stepFields.courses.name = name;

	//Here we accept a file and upload it to clouinary, get a link for that and save it to db
	if (req.file) {
		const file = dataUri(req).content;
		await uploader.upload(file).then((result) => {
			stepFields.courses.img = result.url;
		});
	}

	try {
		let step = await Step.findOne({ name: req.params.step });

		if (!step) {
			return res.status(400).send("Step doesn't exist");
		}

		//push new course to the course array of given step
		step = await Step.findOneAndUpdate(
			{ name: req.params.step },
			{ $push: stepFields },
			{ new: true }
		);
		res.send(stepFields);
	} catch (err) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

//@route    POST api/step/:step/:course/data
//@desc     Add data to the given course of given step
//@access   Private
router.post('/:step/:course/data', multerUploads, async (req, res) => {
	const { title, description, audio } = req.body;

	const stepFields = {};
	if (title) stepFields.title = title;

	//Here we accept a file and upload it to clouinary, get a link for that and save it to db
	if (req.file) {
		const file = dataUri(req).content;
		await uploader.upload(file).then((result) => {
			stepFields.img = result.url;
		});
	}
	if (description) stepFields.description = description;
	if (audio) stepFields.audio = audio;

	try {
		//find the given step
		let step = await Step.findOne({
			name: req.params.step,
		});

		//If given step doesn't exist
		if (!step) {
			return res.status(400).send("Step doesn't exist");
		}

		//find a course in the step with name of given course and push the data object in it
		step.courses.forEach((e) => {
			if (e.name === req.params.course) {
				e.data.push(stepFields);
			}
		});

		await step.save();
		res.send(stepFields);
	} catch (err) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

//@route    GET api/step
//@desc     Get all steps
//@access   Public
router.get('/', async (req, res) => {
	try {
		const step = await Step.find();
		res.json(step);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

module.exports = router;
