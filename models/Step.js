const mongoose = require("mongoose");

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
				},
			],
		},
	],
});

module.exports = Step = mongoose.model("step", StepSchema);
