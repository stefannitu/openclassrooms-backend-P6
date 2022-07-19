const Sauce = require('../models/sauce');
const fs = require('fs');


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
    const sauce = new Sauce({
        userId: req.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
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
    Sauce.findOne({ _id: req.params.id })
        .then((data) => {
            if (req.userId !== data.userId) {
                return res.status(401).json({ message: "Operation not allowed" })
            }

            let sauce = new Sauce({ _id: req.params.id });
            if (req.file) {
                const url = req.protocol + '://' + req.get('host');
                req.body.sauce = JSON.parse(req.body.sauce);
                sauce = {
                    _id: req.params.id,
                    // userId: req.userId,
                    name: req.body.sauce.name,
                    manufacturer: req.body.sauce.manufacturer,
                    description: req.body.sauce.description,
                    heat: req.body.sauce.heat,
                    imageUrl: url + '/images/' + req.file.filename,
                    mainPepper: req.body.sauce.mainPepper,
                }
            } else {
                sauce = {
                    _id: req.params.id,
                    // userId: req.userId,
                    name: req.body.name,
                    manufacturer: req.body.manufacturer,
                    description: req.body.description,
                    heat: req.body.heat,
                    imageUrl: req.body.ImageUrl,
                    mainPepper: req.body.mainPepper,
                }
            }
            Sauce.updateOne({ _id: req.params.id }, sauce)
                .then(() => {
                    res.json({ "message": "update complete" })
                })
                .catch((err) => {
                    res.status(400).json({ "message": err })
                })
        })
        .catch((err) => {
            return res.json({ err })
        })
}


const saucesDeleteOne = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((data) => {
            // if user from request !== owner of post in db
            if (data.userId !== req.userId) {
                console.log(data.userId, req.userId);
                return res.status(401).json({ "message": "Operation not allowed" })
            }
            const picName = data.imageUrl.split('/images/')[ 1 ];
            fs.unlink(`./images/${picName}`, (err) => {
                if (err) return console.log(`./images/${picName}`);;
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.json({ "message": "Product deleted" })
                    })
                    .catch((err) => {
                        res.status(400).json({ "message": err })
                    })
            })
        })

}

const saucesLike = (req, res) => {

    Sauce.findOne({ _id: req.params.id })
        .then((data) => {
            let dt;
            if (req.body.like === 1 && !data.usersLiked.includes(req.body.userId) && !data.usersDisliked.includes(req.body.userId)) {
                (data.usersLiked).push(req.body.userId)
                const likesLenght = data.usersLiked.length;
                const dislikesLenght = data.usersDisliked.length;
                dt = {
                    usersLiked: data.usersLiked,
                    likes: likesLenght,
                    dislikes: dislikesLenght,
                };
            } else if (req.body.like === -1 && !data.usersLiked.includes(req.body.userId) && !data.usersDisliked.includes(req.body.userId)) {
                (data.usersDisliked).push(req.body.userId)
                const likesLenght = data.usersLiked.length;
                const dislikesLenght = data.usersDisliked.length;
                dt = {
                    usersDisliked: data.usersDisliked,
                    likes: likesLenght,
                    dislikes: dislikesLenght,
                };
            } else if (req.body.like === 0) {
                if (data.usersLiked.includes(req.body.userId)) {
                    const newUsersLiked = data.usersLiked.filter(user => user !== req.body.userId);
                    const likesLenght = newUsersLiked.length;
                    const dislikesLenght = data.usersDisliked.length;
                    dt = {
                        usersLiked: newUsersLiked,
                        likes: likesLenght,
                        dislikes: dislikesLenght,
                    };
                }
                if (data.usersDisliked.includes(req.body.userId)) {
                    const newUsersDisliked = data.usersDisliked.filter(user => user !== req.body.userId);
                    const likesLenght = data.usersLiked.length;
                    const dislikesLenght = newUsersDisliked.length;
                    dt = {
                        usersLiked: newUsersDisliked,
                        likes: likesLenght,
                        dislikes: dislikesLenght,
                    };
                }
            } else {
                console.log("no condition met");
            }

            Sauce.updateOne({ _id: req.params.id }, dt).then(() => {
                res.json({ "message": req.body.userId });

            })

        })

}



module.exports = {
    saucesGet,
    saucesPost,
    saucesGetOne,
    saucesPutOne,
    saucesDeleteOne,
    saucesLike
}