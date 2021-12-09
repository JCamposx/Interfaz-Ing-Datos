const express = require('express')
const router = express.Router()
const DB = require('../config/config')

router.get('/analisis', (req, res) => {
	res.render('analisis')
})

module.exports = router