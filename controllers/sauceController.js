const sauceModel = require('../models/sauceModel')
const jwtCheck = require('../helpers/jwtHelper')
const deletePicture = require('../helpers/deletePictureHelper')
const mongoose = require('mongoose');

//get all products from database
const sauceGetAll = async (req, res) => {
    const allSauces = await sauceModel.find({});
    res.status(200).json(allSauces)
}


const sauceGetOne = async (req, res) => {
    try {
        const oneSauce = await sauceModel.findById(req.params.id)
        if (oneSauce) {
            res.status(200).json(oneSauce)
        }
    } catch (error) {
        res.status(404).json({ message: "No product find" })
    }
}


//route to insert in database One Product
const saucePostOne = async (req, res) => {
    try {
        const url = `${req.protocol}://${req.get('host')}`;
        req.body.sauce = JSON.parse(req.body.sauce);
        const sauce = new sauceModel({
            userId: req.userId,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            heat: req.body.sauce.heat,
            imageUrl: url + '/images/' + req.file.filename,
            mainPepper: req.body.sauce.mainPepper,
        })
        const savedSauce = await sauce.save()
        if (savedSauce) {
            return res.status(201).json({ message: "Product added to database" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


//route to update one product in database
const saucePutOne = async (req, res) => {
    let sauce = new sauceModel({})
    // if we have to update product photo
    //body sent by multer
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce)
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
            mainPepper: req.body.mainPepper,
        }
    }
    try {
        // try to update sauce in database
        const sauceUpdate = await sauceModel.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: sauce }).exec()
        if (sauceUpdate == null) {
            return res.status(401).json({ message: 'Update failed product not found' })
        }
        //if udapte was succesfull check picture was updated also
        //if picture was updated then delete old photo
        //finoneandupdate returns document before update
        if (sauce.imageUrl) {
            deletePicture(sauceUpdate.imageUrl);
        }
        res.status(200).json({ message: 'Update product ok' })
    }
    catch (error) {
        return res.status(401).json({ message: 'Update failed ', error: error })
    }
}

//route to delete one element from database
const sauceDeleteOne = async (req, res) => {
    try {
        const sauceDelete = await sauceModel.findOneAndDelete({ _id: req.params.id, userId: req.userId })
        if (sauceDelete == null) {
            res.status(403).json({ message: 'Product operation not allowed ' })
        } else {
            deletePicture(sauceDelete.imageUrl)
            res.status(200).json({ message: 'Product was deleted' })
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    sauceGetAll,
    sauceGetOne,
    saucePostOne,
    saucePutOne,
    sauceDeleteOne
}
