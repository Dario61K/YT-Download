const express = require('express')
const ytControllers = require('../controllers/ytControllers')

const router = express.Router();

router.get('/', ytControllers.res_index)
router.get('/help', ytControllers.res_help)
router.post('/url', ytControllers.url)
router.post('/download', ytControllers.download)

module.exports = router