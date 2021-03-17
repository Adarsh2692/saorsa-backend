const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");

//@route   POST api/mood/new
//@desc    Test route
//@access  Private
router.post("/new", auth, async (req, res) => {
	const { mood, moodImage, rating, date } = req.body;

	//build newMood object
	const newMood = {
		mood,
		moodImage,
		rating,
		date,
	};

	//Build profile object

	const profileFields = {};
	profileFields.moodArray = {};
	if (mood) profileFields.moodArray.mood = mood;
	if (moodImage) profileFields.moodArray.moodImage = moodImage;
	if (rating) profileFields.moodArray.rating = rating;
	if (date) profileFields.moodArray.date = date;

	try {
		let profile = await Profile.findOne({ user: req.user.id });

		if (profile) {
			//Update
			profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $push: profileFields },
				{ new: true }
			);

			return res.json(profile);
		}

		//Create
		// profile = new Profile(profileFields);
		// await profile.save();
		// res.json(profile);

		//add this mood to database

		const latestMood = new Mood(newMood);

		await latestMood.save();

		res.json(latestMood);
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
		const moods = await Profile.findOne({ user: req.user.id });
		res.json(moods.moodArray);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
