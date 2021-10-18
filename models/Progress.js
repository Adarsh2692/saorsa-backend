const { Decimal128 } = require('mongoose');
const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	progressArray: [
		{
			step: {
				type: String
			},
			videos: [
				{
					watchPercentage: {
						type: Decimal128
					}
				}
			],
			total: {
				type: Number
			},
			percentage: {
				type: Number
			}
		}
	]
});

module.exports = Progress = mongoose.model('progress', ProgressSchema);
