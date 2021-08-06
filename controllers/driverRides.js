const User = require('../models/user');
const Ride = require('../models/ride')
const Driver = require('../models/driver');
const driver = require('../models/driver');

// Get Driver Schedule
exports.getSchedule = async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.user._id })
    const driverRides = await Ride.find({ driver_id: currentUser.driver, status: 'Scheduled' })

    return res.status(200).json({ schedule: driverRides })

  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}

// Create a ride
exports.createRide = async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.user._id })
    // If the user isn't a driver yet send an unauthorized response
    if (!currentUser.driver) { return res.status(401).send({ error: 'User is not a driver yet.' }) }

    const newRide = new Ride(req.body)
    newRide.driver_id = currentUser.driver

    const createdRide = await newRide.save()

    return res.json({ ride: createdRide })

  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}

// Cancel a ride
exports.cancelRide = async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.user._id })

    // If the user isn't a driver yet send an unauthorized response
    if (!currentUser.driver) { return res.status(401).send({ error: 'User is not a driver yet.' }) }

    console.log(req.body.id)

    const ride = await Ride.findOne({ _id: req.body.id })

    // If the ride doesn't exist send a 404
    if (!ride) { return res.status(404).send({ error: 'Ride does not exist' }) }

    console.log(ride)

    // If ride is already cancelled send a 400
    if (ride.status === 'Archived') { return res.status(400).send({ error: 'Ride is not active' }) }

    // If the ride is not owned by the current user send an unauthorized response
    if (String(ride.driver_id) !== String(currentUser.driver)) {
      return res.status(401).send(
        { error: 'User is not driver for this ride. Only Drivers can cancel rides' }
      )
    }

    // Update the ride status to Archived
    await ride.updateOne({ status: 'Archived' })

    return res.json({ message: 'Ride has been canceled successfully.' })

  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}