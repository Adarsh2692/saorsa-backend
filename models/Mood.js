const mongoose = require("mongoose");

const MoodSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	moodArray: [
		{
			mood: {
				type: String,
			},
			rating: {
				type: Number,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

module.exports = Mood = mongoose.model("mood", MoodSchema);
