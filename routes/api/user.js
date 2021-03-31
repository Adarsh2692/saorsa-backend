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

const password = process.env.myPass;

const sendEmail = (email, uniqueString) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "addy9769@gmail.com",
			pass: password,
		},
	});
	const mailOptions = {
		from: "addy9769@gmail.com",
		to: email,
		subject: "Verification Email",
		html: `Press<a href=http://localhost:4000/api/user/verify/${uniqueString}>here</a>to verify your account`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log("Email Sent: " + info.response);
		}
	});
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

			const avatar = gravatar.url(email, {
				s: "200",
				r: "pg",
				d: "mm",
			});

			user = new User({
				name,
				email,
				avatar,
				password,
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();
			const profileFields = {};
			profileFields.user = user.id;
			const profile = new Profile(profileFields);
			profile.save();
			const moodFields = {};
			moodFields.user = user.id;
			const mood = new Mood(moodFields);
			mood.save();

			const payload = {
				user: {
					id: user.id,
				},
			};

			const uniqueString = user.id;
			sendEmail(email, uniqueString);

			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err;
					res.send({
						token,
					});
				}
			);
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Server Error");
		}
	}
);

//route    GET api/user/verify/:uniqueString
//desc     Send verification link
//@access  Public
router.get("/verify/:uniqueString", async(req,res)=>{
	try {
		const user=await User.findOne({
			_id:req.params.uniqueString
		})
		user.confirmed=true;
		user.save();
		res.redirect("http://localhost:3000/login");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");	
	}
})

//route    POST api/user/resend
//desc     Send verification link
//@access  Public
router.post("/resend",auth,async(req,res)=>{
	try {
		const user = await User.findById(req.user.id);
		sendEmail(user.email,user.id);
		res.send("Email Sent")
	} catch (err) {
		res.send(err)
	}
})

module.exports = router;
