const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[ 1 ];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const idFromToken = decodedToken.UserId;
        req.userId = idFromToken;
        next();

    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
}


module.exports = auth;