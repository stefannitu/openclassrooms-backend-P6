const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// controller for user login
const login = (req, res) => {

    // check if user exist in database
    User.findOne({ email: req.body.email })
        .then(dbUser => {
            // if cant find user in db status 401 - Unauthorized
            if (!dbUser) {
                return res.status(401).json({
                    message: "Please check email or password"
                })
            }
            // else  encrypt received pass and compare with pass from db
            // bcrypt is a library for  password-hashing

            bcrypt.compare(req.body.password, dbUser.password)
                .then(valid => {
                    //if pass from db doesnt match pass from request body
                    if (!valid) {
                        return res.status(401).json({ message: "Wrong user or password" })
                    }
                    //else-  send back userid and json web token
                    const token = jwt.sign({ UserId: dbUser._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
                    res.status(200).json({
                        userId: dbUser._id,
                        token: token
                    })
                })
        })
        .catch(error => res.status(500).json({ message: error.message }))
}

const signup = (req, res) => {
    //check if req.body.email is a valid password
    const EMAILPATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!EMAILPATTERN.test(req.body.email)) return res.status(404).json({ message: "Invalid Email" })

    //hash password
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });

            //save new user in database
            user.save()
                .then(() => {
                    res.status(201).json({ message: "User added to database" });
                }).catch((error) => {
                    res.status(401).json({ message: error.message })
                })
        })
        .catch(error => res.status(500).json({ message: error.message }))
}

module.exports = {
    login,
    signup,
}