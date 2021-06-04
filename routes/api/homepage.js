const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const Home = require('../../models/Home');
const multerFunc = require('../../middleware/multer');
const multerUploads = multerFunc.multerUploads;
const dataUri = multerFunc.dataUri;
const cloudinary = require('../../config/cloudinaryConfig');
const uploader = cloudinary.uploader;
const cloudinaryConfig = cloudinary.cloudinaryConfig;

router.get('/', async (req, res) => {
	try {
		const home = await Home.findOne({ name: 'home' });
		res.send(home);
	} catch (err) {
		res.send(err);
	}
});

router.post('/', multerUploads, async (req, res) => {
	const { title, description } = req.body;
	const homefields = {};
	if (title) homefields.title = title;
	if (description) homefields.description = description;
	if (req.file) {
		const file = dataUri(req).content;
		await uploader.upload(file).then((result) => {
			homefields.image = result.secure_url;
		});
	}
	try {
		let home = await Home.findOne({ name: 'home' });
		if (home) {
			await Home.findOneAndUpdate(
				{ name: 'home' },
				{ $set: homefields },
				{ new: false }
			);
			let homedata = await Home.findOne({ name: 'home' });
			res.send(homedata);
		} else {
			homefields.name = 'home';
			home = new Home(homefields);
			home.save();
			res.send(home);
		}
	} catch (err) {
		res.send(err + 'error');
	}
});

router.post('/bloglanding', multerUploads, async (req, res) => {
	const blogfields = {};
	if (req.file) {
		const file = dataUri(req).content;
		await uploader.upload(file).then((result) => {
			blogfields.image = result.secure_url;
		});
	}
	try {
		let blog = await Home.findOne({ name: 'blog' });
		if (blog) {
			await Home.findOneAndUpdate(
				{ name: 'blog' },
				{ $set: blogfields },
				{ new: false }
			);
			await Home.findOne({ name: 'blog' });
			res.send("Blog Page Image Updated Successfully");
		} else {
			blogfields.name = 'blog';
			blog = new Home(blogfields);
			blog.save();
			res.send(blog);
		}
	} catch (err) {
		res.send(err + 'error');
	}
});

router.get('/bloglanding', async (req, res) => {
	try {
		const blog = await Home.findOne({ name: 'blog' });
		res.send(blog);
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
