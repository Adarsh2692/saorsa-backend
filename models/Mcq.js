const mongoose = require('mongoose');

const McqSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	sums: [
		{
			mcq: {
				type: String,
			},
			sumArray: [
				{
					type: Number,
				},
			],
		},
	],
});

module.exports = Mcq = mongoose.model('mcq', McqSchema);
