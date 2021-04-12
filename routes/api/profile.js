const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const multerFunc = require("../../middleware/multer");
const multerUploads = multerFunc.multerUploads;
const dataUri = multerFunc.dataUri;
const cloudinary = require("../../config/cloudinaryConfig");
const uploader = cloudinary.uploader;
const cloudinaryConfig = cloudinary.cloudinaryConfig;

//@route    GET api/profile/me
//@desc     Get current user's profile
//@access   Private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "email"]);

		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

//@route    POST api/profile
//@desc     Update user profile
//@access   Private
router.post("/", auth, multerUploads, async (req, res) => {
	const { bio } = req.body;

	//Build profile object
	let profileFields = {};
	profileFields.user = req.user.id;
	if (bio) profileFields.bio = bio;

	//Here we accept a file and upload it to clouinary, get a link for that and save it to db
	if (req.file) {
		const file = dataUri(req).content;
		await uploader.upload(file).then((result) => {
			profileFields.coverImage = result.secure_url;
		});
	}

	try {
		let profile = await Profile.findOne({ user: req.user.id });

		if (profile) {
			//Update profile
			profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);
			return res.json(profileFields);
		}
		return res.json(profileFields);
	} catch (err) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

//@route    GET api/profile
//@desc     Get all profiles
//@access  Public
router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", ["name", "avatar"]);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

//@route    GET api/profile/user/:user_id
//@desc     Get profile by user ID
//@access  Public
router.get("/user/:user_id", async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate("user", ["name", "avatar"]);

		if (!profile) return res.status(400).json({ msg: "Profile not found" });

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == "ObjectId") {
			return res.status(400).json({ msg: "Profile not found" });
		}
		res.status(500).send("Server Error");
	}
});

module.exports = router;

//const upload = multer({
// 	dest:
// 		"uploads",
// }).single("demo_image");

// router.post("/image", (req, res) => {
// 	upload(req, res, (err) => {
// 		if (err) {
// 			res.status(400).send("Something went wrong!");
// 		}
// 		res.send(req.file);
// 	});
// });

// router.get("/image", (req, res) => {
// 	upload(req, res, (err) => {
// 		if (err) {
// 			res.status(400).send("Something went wrong!");
// 		}
// 		res.send(req.file);
// 	});
// });
