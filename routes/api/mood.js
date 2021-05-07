const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const Mood = require("../../models/Mood");

//@route   POST api/mood/new
//@desc    Test route
//@access  Private
router.post("/new", auth, async (req, res) => {
	const { mood, rating, date, score } = req.body;

	//build new Mood object

	const moodFields = {};
	moodFields.moodArray = {};
	if (mood) moodFields.moodArray.mood = mood;
	if (rating) moodFields.moodArray.rating = rating;
	if (date) moodFields.moodArray.date = date;
	if (score) moodFields.moodArray.score = score;

	try {
		let currentMood = await Mood.findOne({ user: req.user.id });

		if (currentMood) {
			//add a new mood to current user's database
			currentMood = await Mood.findOneAndUpdate(
				{ user: req.user.id },
				{ $push: moodFields },
				{ new: true }
			);

			return res.json(currentMood);
		}

	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

//@route   GET api/mood/all
//@desc    Test route
//@access  Private
router.get("/all", auth, async (req, res) => {
	try {
		const moods = await Mood.findOne({ user: req.user.id });
		res.json(moods.moodArray);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
