const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	bio: {
		type: String,
	},
	moodArray: [{
		mood: {
			type: String,
		},
		moodImage: {
			type: String,
		},
		rating: {
			type: Number,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	}, ],
	coverImage: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	//profile page will also contain mood list
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
