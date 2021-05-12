const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Progress = require('../../models/Progress');

router.put('/', auth, async (req, res) => {
	const { step, course } = req.body;

	try {
		let progress = await Progress.findOne({ user: req.user.id });

		progress.progressArray.forEach((s) => {
			if (s.step == step) {
				s.courses.forEach((c) => {
					if (c.done == 0 && c.course==course) {
						s.sum = s.sum + 1;
						s.percentage = (s.sum * 100) / s.total;
						c.done = 1;
					}
				});
				console.log(s);
			}
		});
        progress.save();
		res.json(progress);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

router.get('/', auth, async(req,res)=>{
    try {
        let progress= await Progress.findOne({user:req.user.id});
        res.json(progress);
    } catch (err) {
        console.error(err.message);
		res.status(500).send('Server Error');
    }
})

module.exports = router;