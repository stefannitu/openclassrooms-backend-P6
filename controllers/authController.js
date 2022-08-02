const userModel = require('../models/userModel')

const login = (req, res) => {
    console.log(process.env.PORT);
    res.status(200).json({ message: "tests" })
}

module.exports = {
    login,

}