const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {

    const admin = await User.findOne({
        _id: req.user.id
    });

    if (admin.isAdmin === false)
        return res.status(401).json({
            msg: "Not authorized to access this functionality"
        })

    next();
};