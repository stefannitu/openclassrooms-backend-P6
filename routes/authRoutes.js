const express = require('express');
const router = express.Router();
// destructuring login from controllers
const { login, signup } = require('../controllers/authController');

router.post('/login', login);
router.post('/signup', signup);

module.exports = router;