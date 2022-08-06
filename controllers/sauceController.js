const Sauce = require('../models/sauce');
const fs = require('fs');
const deletePictureHelper = require('../helpers/deletePictureHelper');


//route to get One Product
const saucesGet = (req, res) => {
    Sauce.find()
        .then((sauce) => {
            res.json(sauce);
        })
        .catch((error) => {
            res.status(404).json({ message: error.message })
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
    sauce.save()
        .then(() => {
            res.status(201).json({ message: "Product added to database" })
        })
        .catch((error) => {
            res.status(500).json({ message: error.message })
        })
}

//route to get one product
const saucesGetOne = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(404).json({ message: error.message })
        })
}

//route to update one product
const saucesPutOne = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((data) => {
            // check if product belongs to user
            if (req.userId !== data.userId) {
                return res.status(403).json({ message: "Operation not allowed" })
            }

            let sauce = new Sauce({});

            // if user updated product photo
            if (req.file) {
                //delete old product picture from server
                deletePictureHelper(data);
                const url = req.protocol + '://' + req.get('host');
                req.body.sauce = JSON.parse(req.body.sauce);
                sauce = {
                    name: req.body.sauce.name,
                    manufacturer: req.body.sauce.manufacturer,
                    description: req.body.sauce.description,
                    heat: req.body.sauce.heat,
                    imageUrl: url + '/images/' + req.file.filename,
                    mainPepper: req.body.sauce.mainPepper,
                }
            } else {
                //if we do not need to update photo
                sauce = {
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
                    res.json({ message: "Update complete" })
                })
                .catch((error) => {
                    res.status(400).json({ message: error.message })
                })
        })
        .catch((error) => {
            res.status(500).json({ message: error.message })
        })
}

//delete one product
const saucesDeleteOne = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((data) => {
            // check if product belongs to user
            if (data.userId !== req.userId) {
                return res.status(403).json({ message: "Operation not allowed" })
            }
            //delete product picture from server
            deletePictureHelper(data)
            
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({ message: "Product deleted" })
                })
                .catch(error => {
                    res.status(500).json({ message: error.message })
                })
        })
        .catch(error => {
            res.status(500).json({ message: error.message })
        })

}

//logic for product likes/dislikes
const saucesLike = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((data) => {
            //destructuring
            const { userId, like } = req.body;
            const { usersLiked, usersDisliked } = data;
            let productLikes;

            //OPTIONS:
            //1 - like
            //0 - retract like/dislike
            //-1 - dislike

            //user did not vote yet
            if (!usersLiked.includes(userId)
                && !usersDisliked.includes(userId)) {

                switch (like) {
                    case 1:
                        usersLiked.push(userId)
                        break;
                    case -1:
                        usersDisliked.push(userId)
                        break;
                    default:
                        res.status(405).json({ message: "Not allowed" });
                        break;
                }
            } else {
                //if user is retracting like/dislike
                if (like == 0) {
                    if (usersDisliked.includes(userId)) {
                        const index = usersDisliked.findIndex(element => element == userId)
                        usersDisliked.splice(index, 1);
                    }
                    if (usersLiked.includes(userId)) {
                        const index = usersLiked.findIndex(element => element == userId)
                        usersLiked.splice(index, 1);
                    }
                } else {
                    res.status(405).json({ message: "Not allowed" });
                }
            }

            const likesLenght = usersLiked.length;
            const dislikesLenght = usersDisliked.length;
            productLikes = {
                usersLiked: usersLiked,
                usersDisliked: usersDisliked,
                likes: likesLenght,
                dislikes: dislikesLenght,
            };

            Sauce.updateOne({ _id: req.params.id }, productLikes).then(() => {
                res.json({ "message": userId });
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