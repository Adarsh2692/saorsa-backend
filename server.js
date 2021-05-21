const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const multerFunc = require('./middleware/multer');
const multerUploads = multerFunc.multerUploads;
const dataUri = multerFunc.dataUri;
const cloudinary = require('./config/cloudinaryConfig');
const uploader = cloudinary.uploader;
const cloudinaryConfig = cloudinary.cloudinaryConfig;
const passport = require('passport');

const app = express();

app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

app.use('*', cloudinaryConfig);

//Connect Database
connectDB();

//Init middleware
app.use(
	express.json({
		extended: false,
	})
);

// app.use(function (req, res) {
// 	res.sendFile(path.join(__dirname, "./client/public/index.html"));
// });

// app.get("/", function (req, res) {
// 	res.sendFile(path.join(__dirname, "./client/public/index.html"));
// });

app.get('/', (req, res) => {
	res.send('Server running');
});

app.post('/uploads', multerUploads, (req, res) => {
	if (req.file) {
		const file = dataUri(req).content;
		return uploader
			.upload(file)
			.then((result) => {
				const image = result.url;
				console.log(image);
				return res.status(200).json({
					message: 'Your image has been uploded successfully to cloudinary',
					data: {
						image,
					},
					result,
					image,
				});
			})
			.catch((err) =>
				res.status(400).json({
					message: 'someting went wrong while processing your request',
					data: {
						err,
					},
				})
			);
	}
});

//Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/progress', require('./routes/api/progress'));
app.use('/api/courses', require('./routes/api/courses'));
app.use('/api/mood', require('./routes/api/mood'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/step', require('./routes/api/step'));
app.use('/api/blog', require('./routes/api/blog'));
app.use('/api/mcq', require('./routes/api/mcq'));

// Serve static assets in production
// if(process.env.NODE_ENV==='production'){
//     //Set static folder
//     app.use(express.static('client/build'));

//     app.get('*', (req,res)=>{
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });
// }

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});

//"heroku-postbuild":"NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
