const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	progressArray: [
		{
			step: {
				type: String,
			},
			courses: [
				{
					course: {
						type: String,
					},
					done: {
						type: Number,
						default: 0,
					},
				},
			],
			total: {
				type: Number,
			},
			sum: {
				type: Number,
				default: 0,
			},
			percentage: {
				type: Number,
			},
		},
	],
});

module.exports = Progress = mongoose.model('progress', ProgressSchema);
