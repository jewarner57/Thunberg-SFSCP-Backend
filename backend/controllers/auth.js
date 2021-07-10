const User = require('../models/user');
const Rider = require('../models/rider')
const Driver = require('../models/driver')
const jwt = require('jsonwebtoken')

// SIGN IN
exports.signin = async (req, res) => {
  try {

    const { email, password } = req.body

    // Find this user name
    const user = await User.findOne({ email }, 'email password')

    // If User not found
    if (!user) {
      return res.status(401).send({ message: 'Wrong Email or Password' });
    }

    // Check if password matches
    user.comparePassword(password, (err, isMatch) => {

      if (!isMatch) {
        // If password does not match return an error
        return res.status(401).send({ message: 'Wrong Email or password' });
      }

      // Create a token
      const token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET_KEY, {
        expiresIn: '60 days',
      });

      // Set a cookie
      res.cookie('authToken', token, { maxAge: 900000, httpOnly: true });
      res.json({ message: 'Login Successful' })
    })

  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}


// SIGN UP
exports.signup = async (req, res) => {
  try {
    // Create User
    const newuser = new User(req.body);

    const user = await User.findOne({ email: newuser.email })

    // If user already exists return an error
    if (user) { return res.status(409).send({ err: 'Email already in use.' }) }

    // Save user and send token
    const createdUser = await newuser.save()

    const token = jwt.sign({ _id: createdUser._id }, process.env.SECRET_KEY, { expiresIn: '60 days' });
    res.cookie('authToken', token, { maxAge: 900000, httpOnly: true });
    res.json({ user: createdUser })
  }
  catch (err) {
    return res.status(400).send({ err });
  }
}

// SIGN OUT
exports.signout = (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logout Successful' })
}

// CREATE RIDER PROFILE
exports.riderinfo = async (req, res) => {
  try {
    // Check if rider already exists
    const currentUser = await User.findOne({ _id: req.user._id })
    const rider = await Rider.findOne({ _id: currentUser.rider })

    if (rider) { return res.status(409).send({ message: 'This user is already a rider.' }) }

    // Save the new rider
    const newRider = new Rider(req.body);
    const createdRider = await newRider.save()

    // Update the user to include the new rider
    await User.updateOne({ rider: createdRider._id })

    // Return the new rider
    return res.send({ rider: createdRider })
  }
  catch (err) {
    return res.status(400).send({ err });
  }
}

// CREATE DRIVER PROFILE
exports.driverinfo = async (req, res) => {
  try {
    // Check if driver already exists
    const currentUser = await User.findOne({ _id: req.user._id })
    const driver = await Driver.findOne({ _id: currentUser.driver })

    if (driver) { return res.status(409).send({ message: 'This user is already a driver.' }) }

    // Save the new drover
    const newDriver = new Driver(req.body);
    const createdDriver = await newDriver.save()

    // Update the user to include the new driver
    await User.updateOne({ driver: createdDriver._id })

    // Return the new driver
    return res.send({ driver: createdDriver })
  }
  catch (err) {
    return res.status(400).send({ err });
  }
}
