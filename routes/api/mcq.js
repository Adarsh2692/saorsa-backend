const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Mcq = require('../../models/Mcq');

router.get('/', auth, async(req,res)=>{
    try {
        let mcqArray= await Mcq.findOne({user:req.user.id});
        res.json(mcqArray);
    } catch (err) {
        console.error(err.message);
		res.status(500).send('Server Error');
    }
})

module.exports = router;