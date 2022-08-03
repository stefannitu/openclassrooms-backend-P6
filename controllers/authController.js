const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//login ROUTE
const login = async (req, res) => {
    try {
        //check user in database
        const userData = await userModel.findOne({ email: req.body.email })
        //if user not in database 
        if (!userData) {
            return res.status(404).json({ message: "User not found" })
        }
        //else
        const match = await bcrypt.compare(req.body.password, userData.password)
        if (match) {
            const token = jwt.sign({ userId: userData._id }, process.env.SECRET, { expiresIn: '24h' })
            return res.status(200).json({
                userId: userData._id,
                token: token
            })
        }
        res.status(404).json({ message: 'Wrong email/password' })
    } catch (error) {
        console.log(error)
    }
}

//signup ROUTE
const signup = async (req, res) => {
    //REGEX check if email is valid
    //check if password field is not empty
    const EMAIL_PATTERN = /^\w{2,}([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!EMAIL_PATTERN.test(req.body.email) || req.body.password.trim() == '') {
        return res.status(401).json({
            message: 'Invalid email/password'
        })
    }
    //if signup data is ok then continue
    try {
        const password_hash = await bcrypt.hash(req.body.password, 10)

        const user = new userModel({
            email: req.body.email,
            password: password_hash
        })
        //save user in database
        const savedUser = await user.save(user)
        if (savedUser) {
            res.status(203).json({ message: 'User saved' })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

module.exports = {
    login,
    signup
}