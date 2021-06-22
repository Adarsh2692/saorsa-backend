const mongoose = require('mongoose');

const FormSubmitSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	responses: [
		{
			name: {
				type: String,
			},
			qnaResponses: [
				{
					questions: [
						{
							type: String,
						},
					],
					answers: [
						{
							ans: {
								type: String,
							},
							score: {
								type: Number,
							},
						},
					],
					date: {
						type: Date,
						default: Date.now,
					},
				},
			],
		},
	],
});

module.exports = FormSubmit = mongoose.model('formsubmit', FormSubmitSchema);
