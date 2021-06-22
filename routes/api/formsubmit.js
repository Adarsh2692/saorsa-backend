const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const FormSubmit = require('../../models/FormSubmit');

router.get('/', auth, async (req, res) => {
	try {
		let finalform = await FormSubmit.findOne({ user: req.user.id });
		res.json(finalform);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/:name', auth, async (req, res) => {
	try {
		let finalform = await FormSubmit.findOne({ user: req.user.id });
		let k = 0;
		finalform.responses.forEach((r) => {
			if (r.name == req.params.name) {
				res.json(r);
				k == 1;
			}
		});
		if (k == 0) {
			res.send('there is no such form');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post('/', auth, async (req, res) => {
	const { name, questions, answers } = req.body;
	let qnaField = {};
	qnaField.questions = questions;
	qnaField.answers = answers;
	try {
		let finalform = await FormSubmit.findOne({ user: req.user.id });
		let k = 0;
		finalform.responses.forEach((r) => {
			if (r.name == name) {
				r.qnaResponses.push(qnaField);
				k = 1;
			}
		});
		if (k == 0) {
			let response = {};
			response.name = name;
			response.qnaResponses = qnaField;
			finalform.responses.push(response);
		}
		await finalform.save();
		res.json(finalform);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
