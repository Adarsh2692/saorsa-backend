const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Mood = require("../../models/Mood");
const nodemailer = require("nodemailer");
const auth = require("../../middleware/auth");
const { google } = require("googleapis");

const password = process.env.myPass;
const cid = process.env.cid;
const csec = process.env.csec;
const ruri = process.env.ruri;
const rtoken ="1//04hBd5M_CWeV6CgYIARAAGAQSNwF-L9IrX1WZjFubf61NB_8iLlshOXcNHARYvpmd9LpCUeko3r2s4j7wzsWqL2XrvXkjCB07Nhk";

const oAuth2Client = new google.auth.OAuth2(cid, csec, "https://developers.google.com/oauthplayground");
oAuth2Client.setCredentials({ refresh_token: rtoken });

//Function to send email using nodemailer
const sendEmail = async (email, uniqueString) => {
	try {
		//Account details of the sender
		const accessToken = await oAuth2Client.getAccessToken();
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "adarsh7506774609@gmail.com",
				clientId: cid,
				clientSecret: csec,
				refreshToken: rtoken,
				accessToken: accessToken,
			},
		});
		//Email sender
		const mailOptions = {
			from: "Saorsa <adarsh7506774609@gmail.com>",
			to: email,
			subject: "Verification Email",
			html: `Press <button><a href=https://mighty-bastion-04883.herokuapp.com/api/user/verify/${uniqueString}>here</a></button> to verify your account`,
		};

		await transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				res.error(error);
				console.log(error);
			} else {
				res.send(info.response);
				console.log("Email Sent: " + info.response);
			}
		});
	} catch (err) {
		console.log(err);
	}
};

//route    POST api/user
//desc     Register user
//@access  Public
router.post(
	"/",
	[
		check("name", "Name is Required").notEmpty(),
		check("email", "Please enter a valid email").isEmail(),
		check(
			"password",
			"Please enter a password with 6 or more characters"
		).isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({
				email,
			});

			if (user) {
				return res.status(400).json({
					errors: [
						{
							msg: "User Already exists",
						},
					],
				});
			}

			//Creating a new user object
			user = new User({
				name,
				email,
				password,
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			//Saving the data in database
			await user.save();

			//Simultaneously creating profile and mood object and saving in database
			const profileFields = {};
			profileFields.user = user.id;
			const profile = new Profile(profileFields);
			profile.save();

			const moodFields = {};
			moodFields.user = user.id;
			const mood = new Mood(moodFields);
			mood.save();

			//Appending the user ID at the back of email link to make it unique
			const uniqueString = user.id;
			sendEmail(email, uniqueString);
			res.send("user added");
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Server Error");
		}
	}
);

//route    GET api/user/verify/:uniqueString
//desc     Send verification link
//@access  Public
router.get("/verify/:uniqueString", async (req, res) => {
	try {
		const user = await User.findOne({
			_id: req.params.uniqueString,
		});
		user.confirmed = true;
		user.save();
		res.redirect("http://localhost:3000/login");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

//route    POST api/user/resend
//desc     Resend verification link to given email
//@access  Public
router.post("/resend", async (req, res) => {
	//taking email from user
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		sendEmail(user.email, user.id);
		res.send("Email Sent");
	} catch (err) {
		res.send(err);
	}
});

//route    POST api/user/social
//desc     Social Login
//@access  Public
router.post("/social", async (req, res) => {
	//get email and name from facebook or google
	const { name, email, avatar } = req.body;
	try {
		let user = await User.findOne({ email });
		let confirmed = true;

		//If user with given email doesn't exist, create a new user
		if (!user) {
			user = new User({
				name,
				email,
				confirmed,
			});
			await user.save();

			//Simultaneously creating profile and mood object and saving in database
			const profileFields = {};
			profileFields.user = user.id;
			profileFields.coverImage = avatar;
			const profile = new Profile(profileFields);
			profile.save();

			const moodFields = {};
			moodFields.user = user.id;
			const mood = new Mood(moodFields);
			mood.save();
		}

		/*
		If user has manually registered on the website, 
		the email will not be confirmed unless the verification link is accessed.
		If this user tries to use social login, we will first set confirmed to true
		*/
		if (!user.confirmed) {
			user.confirmed = true;
		}
		user.coverimage=avatar;

		user.save();

		const payload = {
			user: {
				id: user.id,
			},
		};
		jwt.sign(
			payload,
			config.get("jwtSecret"),
			{
				expiresIn: 360000,
			},
			(err, token) => {
				if (err) throw err;
				res.send({ token });
			}
		);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
