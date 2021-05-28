const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const FormSubmit = require('../../models/FormSubmit');

router.post('/', auth, async (req, res) => {
	const { q1, a1, q2, a2, q3, a3, q4, a4, q5, a5, q6, a6, q7, a7 } = req.body;
	let formFields = { q1, a1, q2, a2, q3, a3, q4, a4, q5, a5, q6, a6, q7, a7 };
	try {
		let finalform = await FormSubmit.findOne({ user: req.user.id });
		finalform.responses.push(formFields);
		await finalform.save();
		res.json(finalform);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/', auth, async (req, res) => {
	try {
		let finalform = await FormSubmit.findOne({ user: req.user.id });
		res.json(finalform);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
