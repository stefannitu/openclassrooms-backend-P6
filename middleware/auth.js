const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[ 1 ];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const idFromToken = decodedToken.UserId;
        req.userId = idFromToken;

        if (req.body.userId && req.body.userId !== idFromToken) {
            throw console.log(req.userId);
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: (req.body.userId)
        });
    }
}


module.exports = auth;