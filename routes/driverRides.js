const express = require('express')
const isAuth = require('../middleware/isAuth')
const { body } = require('express-validator')

const router = express.Router()

const driverRidesController = require('../controllers/driverRides')

router.get('/schedule', isAuth, driverRidesController.getSchedule)

router.post('/create-ride', isAuth, driverRidesController.createRide)

router.post('/cancel-ride', isAuth, driverRidesController.cancelRide)

module.exports = router