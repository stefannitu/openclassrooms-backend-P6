const express = require('express');
const router = express.Router();
const { saucesGet, saucesPost, saucesGetOne, saucesPutOne, saucesDeleteOne, saucesLike } = require('../controllers/sauceController');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/sauces/:id/like', auth, saucesLike);
router.put('/sauces/:id', auth, multer, saucesPutOne);
router.get('/sauces/:id', auth, saucesGetOne);
router.get('/sauces', auth, saucesGet);
router.post('/sauces', auth, multer, saucesPost);
router.delete('/sauces/:id', auth, saucesDeleteOne);



module.exports = router;