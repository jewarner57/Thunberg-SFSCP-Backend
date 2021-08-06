const User = require('../models/user');
const Rider = require('../models/rider')
const Ride = require('../models/ride')
const Driver = require('../models/driver')

// Get Rider Schedule
exports.getSchedule = async (req, res) => {
  try {


  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}

// Join a ride
exports.joinRide = async (req, res) => {
  try {
    const rideToJoin = await Ride.findOne({ _id: req.body.id })
    const currentUser = await User.findOne({ _id: req.user._id })
    const rider = await Rider.findOne({ _id: currentUser.rider })

    if (!currentUser.rider) { return res.status(401).send({ error: 'User is not a rider yet.' }) }

    const riderArray = rideToJoin.riders
    riderArray.push({
      rider: currentUser.rider,
      location: rider.location
    })

    const joinedRide = await Ride.findOneAndUpdate({ _id: rideToJoin._id }, { $set: { riders: riderArray } }, { new: false })

    return res.status(200).send({ message: 'Ride successfully joined!', ride: joinedRide })

  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}

// Leave a ride
exports.leaveRide = async (req, res) => {
  try {

    const rideToLeave = await Ride.findOne({ _id: req.body.id })
    const currentUser = await User.findOne({ _id: req.user._id })

    if (!currentUser.rider) { return res.status(401).send({ error: 'User is not a rider yet.' }) }

    // Test if the rider is added to the ride
    let riderIsInRide = false

    console.log(rideToLeave)

    rideToLeave.riders.forEach((rider) => {
      if (String(rider.rider) === String(currentUser.rider)) {
        riderIsInRide = true
      }
    })

    // If the rider is not in the ride, return an error
    if (!riderIsInRide) { return res.status(409).send({ error: 'User is not in this ride' }) }

    // Remove the rider from the ride
    const riderArray = rideToLeave.riders
    const filteredRiderArray = riderArray.filter((ride) => {
      return !ride.rider === currentUser.rider
    })

    const leftRide = await Ride.findOneAndUpdate({ _id: rideToLeave._id }, { $set: { riders: filteredRiderArray } }, { new: false })

    return res.status(200).send({ message: 'Successfully left ride.', ride: leftRide._id })


  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}