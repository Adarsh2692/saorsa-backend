const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Step = require("../../models/Step");

//@route    POST api/step/create
//@desc     Update user profile
//@access   Private
router.post("/create", async (req, res) => {
	const { name, title, headingText } = req.body;

	//Build step object
	const stepFields = {};
	if (name) stepFields.name = name;
	if (title) stepFields.title = title;
	if (headingText) stepFields.headingText = headingText;

	try {
		let step = await Step.findOne({ name: req.name });

		if (step) {
			return res.status(400).send("Step already exists");
		}
		const newStep = new Step(stepFields);
		newStep.save();
		res.send(newStep);
	} catch (err) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

//@route    POST api/step/:step/courses
//@desc     Update user profile
//@access   Private
router.post("/:step/courses", async (req, res) => {
	const { img, name } = req.body;

	//Build course object
	const stepFields = {};
	stepFields.courses = {};
	if (name) stepFields.courses.name = name;
	if (img) stepFields.courses.img = img;

	try {
		let step = await Step.findOne({ name: req.params.step });

		if (!step) {
			return res.status(400).send("Step doesn't exist");
		}
		step = await Step.findOneAndUpdate(
			{ name: req.params.step },
			{ $push: stepFields },
			{ new: true }
		);
		res.send(stepFields);
	} catch (err) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

//@route    POST api/step/:step/:course/data
//@desc     Update user profile
//@access   Private
router.post("/:step/:course/data", async (req, res) => {
	const { title, description, audio, img } = req.body;
	const stepFields = {};
	if (title) stepFields.title = title;
	if (img) stepFields.img = img;
	if (description) stepFields.description = description;
	if (audio) stepFields.audio = audio;

	try {
		let step = await Step.findOne({
			name: req.params.step,
		});
		res.json(step.courses);
		step.courses.forEach(e=>{
			if(e.name===req.params.course){
				e.data.push(stepFields);
			}
		})
		await step.save();
	} catch (err) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

//@route    GET api/step
//@desc     Update user profile
//@access   Private
router.get("/",async (req,res)=>{
	try {
		const step = await Step.find();
		res.json(step);
	} catch (err) {
		res.status(500).send(err.message);
	}
})

module.exports = router;
