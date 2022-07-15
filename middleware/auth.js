const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[ 1 ];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, user) => {
        if (err) return res.resStatus(403);
        req.userId = user.UserId;
        console.log(user);
        next()
    })



    /* try {
        const token = req.headers.authorization.split(' ')[ 1 ];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const Id = decodedToken.UserId;
        req.userId = Id;
        if (req.body.userId && req.body.userId !== Id) {
            console.log(req.body.userId, { userId });;
        } else {
            next();
        }
    }
    catch (error) {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    } */
}


module.exports = auth;