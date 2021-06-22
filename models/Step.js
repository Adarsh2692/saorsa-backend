const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	title: {
		type: String,
	},
	headingText: {
		type: String,
	},
	image: {
		type: String,
	},
	courses: [
		{
			img: {
				type: String,
			},
			name: {
				type: String,
			},
			data: [
				{
					category: {
						type: String,
						default: 'normal',
					},
					title: {
						type: String,
					},
					description: {
						type: String,
					},
					img: {
						type: String,
					},
					audio: {
						type: String,
					},
					video: {
						type: String,
					},
					thumbnail: {
						type: String,
					},
				},
			],
		},
	],
});

module.exports = Step = mongoose.model('step', StepSchema);
