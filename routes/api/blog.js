const express = require('express');
const Blog = require('../../models/Blog');
const router = express.Router();
const multerFunc = require('../../middleware/multer');
const multerUploads = multerFunc.multerUploads;
const dataUri = multerFunc.dataUri;
const cloudinary = require('../../config/cloudinaryConfig');
const uploader = cloudinary.uploader;
const cloudinaryConfig = cloudinary.cloudinaryConfig;

router.get('/:title', async (req, res) => {
	try {
		blog = await Blog.findOne({ title: req.params.title });
		res.send(blog);
	} catch (err) {
		res.json({ msg: err });
	}
});

router.get('/all', async (req, res) => {
	try {
		blog = await Blog.find();
		res.send(blog);
	} catch (err) {
		res.json({ msg: err });
	}
});

router.post('/', multerUploads, async (req, res) => {
	const { title, content, description } = req.body;

	const blogFields = {};
	if (title) blogFields.title = title;
	if (content) blogFields.content = content;
	if (description) blogFields.description = description;
	if (req.file) {
		const file = dataUri(req).content;
		await uploader.upload(file).then((result) => {
			blogFields.image = result.secure_url;
		});
	}

	try {
		const test = await Blog.findOne({ title });
		if (!test) {
			const blog = new Blog(blogFields);
			blog.save();
			res.send('Blog uploaded');
		} else res.send('Please alter the title as the same title already exists');
	} catch (err) {
		res.json({ msg: err });
	}
});

router.delete('/delete', async (req, res) => {
	const { title } = req.body;
	try {
		const blog = await Blog.find({ title });
		if (blog) {
			await Blog.deleteOne({ title });
			res.send(`${title} deleted from blog list`);
		} else res.send("This blog doesn't exist");
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = router;
