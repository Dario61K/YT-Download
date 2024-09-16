const express = require('express')
const ytControllers = require('../controllers/ytControllers')

const router = express.Router();

router.get('/', ytControllers.res_index)
router.post('/url', ytControllers.url)
router.post('/download', ytControllers.download)

module.exports = router