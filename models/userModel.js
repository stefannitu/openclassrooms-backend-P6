const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, uniqueCaseInsensitive: true },
    password: { type: String }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema);