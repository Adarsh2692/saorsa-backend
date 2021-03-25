const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

//Connect Database
connectDB();

//Init middleware
app.use(express.json({
    extended: false
}));

// app.use(function (req, res) {
// 	res.sendFile(path.join(__dirname, "./client/public/index.html"));
// });

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "./client/public/index.html"));
});

//Define routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/courses", require("./routes/api/courses"));
app.use("/api/mood", require("./routes/api/mood"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/step", require("./routes/api/step"));

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
})

//"heroku-postbuild":"NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"