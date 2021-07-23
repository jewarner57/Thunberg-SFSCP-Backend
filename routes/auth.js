const express = require('express')
const isAuth = require('../middleware/isAuth')
const { body } = require('express-validator')

const router = express.Router()

const authController = require('../controllers/auth')

router.post('/signin', authController.signin)

router.post('/signup', authController.signup)

router.post('/signout', isAuth, authController.signout)

router.post('/rider-info', isAuth, authController.riderinfo)

router.post('/driver-info', isAuth, authController.driverinfo)

module.exports = router