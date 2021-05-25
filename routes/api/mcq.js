const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Mcq = require('../../models/Mcq');

//@route   GET api/mcq
//@desc    Get mcq score array
//@access  Private
router.get('/', auth, async (req, res) => {
	try {
		let mcqArray = await Mcq.findOne({ user: req.user.id });
		res.json(mcqArray);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//@route   PUT api/mcq
//@desc    Push score to mcq array
//@access  Private
router.put('/', auth, async (req, res) => {
	const { mcq, score } = req.body;
	try {
		let mcqArray = await Mcq.findOne({ user: req.user.id });
		mcqArray.sums.forEach((e) => {
			if (e.mcq == mcq) {
				e.sumArray.push(score);
			}
		});
		mcqArray.save();
		res.json(mcqArray);
	} catch (err) {}
});

module.exports = router;
