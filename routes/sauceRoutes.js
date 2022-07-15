const express = require('express');
const router = express.Router();
const { saucesGet, saucesPost, saucesGetOne, saucesPutOne, saucesDeleteOne } = require('../controllers/sauceController');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/sauces', saucesGet);
router.post('/sauces', multer, saucesPost);
router.get('/sauces/:id', saucesGetOne);
router.put('/sauces/:id', multer, saucesPutOne);
router.delete('/sauces/:id', saucesDeleteOne);



module.exports = router;