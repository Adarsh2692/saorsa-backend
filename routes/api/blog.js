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

router.post('/', async (req, res) => {
	const { title, content } = req.body;
	const blogFields = {};
	blogFields.title = title;
	blogFields.content = content;
	// console.log(content);
	try {
		const test = await Blog.findOne({ title });
		if (!test) {
            blog =new Blog(blogFields);
			await blog.save();
			res.send(blog);
		} else res.send('Please alter the title');
	} catch (err) {
		res.json({ msg: err });
	}
});

module.exports = router;
