const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	name: {
		type: String,
	},
	progressArray: [
		{
			total: {
				type: Number,
			},
			sum: {
				type: Number,
				default: 0,
			},
			percentage: {
				type: mongoose.Schema.Types.Decimal128,
			},
		},
	],
});

module.exports = Progress = mongoose.model('progress', ProgressSchema);
