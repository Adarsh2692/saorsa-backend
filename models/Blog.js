const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	image: {
		type: String,
	},
	content: {
		type: String,
	},
});

module.exports = Blog = mongoose.model('blog', BlogSchema);
