const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
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
			mcq: {
				name: {
					type: String,
				},
				mcqs: [
					{
						question: {
							type: String,
						},
						options: [
							{
								option: {
									type: String,
								},
								value: {
									type: Number,
								},
							},
						],
					},
				],
			},
		},
	],
});

module.exports = Course = mongoose.model('course', CourseSchema);
