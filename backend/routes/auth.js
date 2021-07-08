const express = require('express')

const { body } = require('express-validator')

const router = express.Router()

const authController = require('../controllers/auth')

router.post('/login', authController.login)

router.post('/signup', authController.signup)

module.exports = router