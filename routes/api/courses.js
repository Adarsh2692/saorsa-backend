const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const Course = require("../../models/Course");

//@route   POST api/courses/new
//@desc    Test route
//@access  Private
router.post("/new", auth, adminAuth, async (req, res) => {
    const {
        courseName,
        courseImage,
        musicLink,
        exerciseLink
    } = req.body;

    //build newCourse object
    const newCourse = {
        courseName,
        courseImage,
        musicLink,
        exerciseLink,
    };

    try {
        //add this course to database
        const latestCourse = new Course(newCourse);

        await latestCourse.save();

        res.json(latestCourse);
    } catch (err) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

//@route   GET api/courses/all
//@desc    Test route
//@access  Private
router.get("/all", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
