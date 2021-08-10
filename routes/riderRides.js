const express = require('express')
const isAuth = require('../middleware/isAuth')
const { body } = require('express-validator')

const router = express.Router()

const riderRidesController = require('../controllers/riderRides')

router.get('/schedule', isAuth, riderRidesController.getSchedule)

router.post('/join-ride', isAuth, riderRidesController.joinRide)

router.post('/leave-ride', isAuth, riderRidesController.leaveRide)

router.get('/find-ride', isAuth, riderRidesController.findRide)

module.exports = router