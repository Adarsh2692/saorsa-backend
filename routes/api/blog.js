const express = require('express');
const Blog = require('../../models/Blog');
const router = express.Router();

router.get('/', async (req, res) => {
	const { title } = req.body;
	try {
		blog = await Blog.findOne({ title });
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

router.post('/', async (req, res) => {
	const { title, content } = req.body;
	const blogFields = {};
	blogFields.title = title;
	blogFields.content = content;
	try {
		const test = await Blog.findOne({ title });
		if (!test) {
			const blog = new Blog(blogFields);
			await blog.save();
			res.send('ok');
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
