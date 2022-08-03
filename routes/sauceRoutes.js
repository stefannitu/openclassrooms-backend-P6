const authMiddleware = require('../middleware/authMiddleware')
const multerMiddleware = require('../middleware/multerMiddleware')
const { sauceGetAll, sauceGetOne, saucePostOne, saucePutOne, sauceDeleteOne } = require('../controllers/sauceController')
const express = require('express')
const router = express.Router()

router.put('/:id', authMiddleware, multerMiddleware, saucePutOne)
router.get('/:id', authMiddleware, sauceGetOne)
router.get('/', authMiddleware, sauceGetAll)
router.post('/', authMiddleware, multerMiddleware, saucePostOne)
router.delete('/:id', authMiddleware, sauceDeleteOne)

module.exports = router;