require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const authRoutes = require('./routes/authRoutes')
const sauceRoutes = require('./routes/sauceRoutes')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('public'))

//  Routes
app.use('/api/auth', authRoutes)
app.use('/api/sauces', sauceRoutes)

const connectAndStart = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(process.env.PORT || 3000, () => {
            console.log('Connection established.Server running on port', process.env.PORT);
        })
    } catch (err) {
        console.log(err)
    }
}

connectAndStart();