const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	title: {
		type: String,
	},
	description: {
		type: String,
	},
	image: {
		type: String,
	},
});

module.exports = Home = mongoose.model('home', HomeSchema);
