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


  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}