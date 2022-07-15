const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');


//route to get One Product
const saucesGet = (req, res) => {
    Sauce.find()
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((err) => {
            res.status(400).json({ "message": "saucesGET all error" })
        })
}

//route to insert in database One Product
const saucesPost = (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);

    /* const token = req.headers.authorization.split(' ')[ 1 ];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.UserId;
    console.log(decodedToken);
 */

    const sauce = new Sauce({
        userId: req.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
    });
    sauce.save().then(() => {
        res.status(201).json({ "message": ` added to db` })
    })
        .catch((err) => {
            res.status(400).json({ "message": err })
        })
}

const saucesGetOne = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(400).json({ "message": err })
        })
}

const saucesPutOne = (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        _id: req.params.id,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
    });
    Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => {
            res.json({ "message": "update complete" })
        })
        .catch((err) => {
            res.status(400).json({ "message": err })
        })
}

const saucesDeleteOne = (req, res) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
            res.json({ "message": "Product deleted" })
        })
        .catch((err) => {
            res.status(400).json({ "message": err })
        })
}

module.exports = {
    saucesGet,
    saucesPost,
    saucesGetOne,
    saucesPutOne,
    saucesDeleteOne
}