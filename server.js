require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');




const app = express();
const authRouter = require('./routes/authRoutes');
const sauceRouter = require('./routes/sauceRoutes');


app.use('/images', express.static(path.join(__dirname, 'images')));

/* 
    Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows
     a server to indicate any origins (domain, scheme, or port) other than its own from 
     which a browser should permit loading resources. 
*/
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', sauceRouter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`Server working on port ${process.env.PORT || 4000}`)
        })
    }).catch((err) => {
        console.log(err);
    })
