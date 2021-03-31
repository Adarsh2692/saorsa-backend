const multer = require("multer");
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const path = require("path");
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");
const dataUri = (req) =>
	parser.format(
		path.extname(req.file.originalname).toString(),
		req.file.buffer
	);
module.exports = { multerUploads, dataUri };
