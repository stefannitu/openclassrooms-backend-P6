const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// controller for user login
const login = (req, res) => {
    // check if user exist in database
    User.findOne({
        email: req.body.email,
    }).then(dbUser => {
        // if cant find user in db status 501
        if (!dbUser) {
            return res.status(401).json({
                "message": "Please check email or password"
            })
        }
        // else  encrypt received pass and compare with pass from db
        bcrypt.compare(req.body.password, dbUser.password)
            .then(valid => {
                //if pass from db doesnt match pass from request body
                if (!valid) {
                    return res.status(401).json({
                        "message": "wrong password"
                    })
                }
                //else-  send back userid and jwt token
                const token = jwt.sign({ UserId: dbUser._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
                res.status(200).json({
                    userId: dbUser._id,
                    token: token
                })

            })
            .catch(error => {
                res.status(401).json({
                    error: error
                })
            })


    })
}

const signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() => {
                    res.status(201).json({ "message": `${req.body} added to db` });
                }).catch((err) => {
                    res.status(401).json({ err })
                })
        })
}

module.exports = {
    login,
    signup,
}