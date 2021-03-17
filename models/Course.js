const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
	courseName: {
		type: String,
	},
	courseImage: {
		type: String,
	},
	musicLink: {
		type: String,
	},
	exerciseLink: {
		type: String,
	},
});

module.exports = Course = mongoose.model("course", CourseSchema);
