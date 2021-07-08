const User = require('../models/user');
const jwt = require('jsonwebtoken')

// LOGIN
exports.login = async (req, res) => {
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
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
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
    res.cookie('nToken', token, { maxAge: 900000 });
    res.json({ createdUser })
  }
  catch (err) {
    return res.status(400).send({ err });
  }
}

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie('nToken');
  res.json({ message: 'Logout Successful' })
}