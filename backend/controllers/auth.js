const User = require('../models/user');
const jwt = require('jsonwebtoken')

// LOGIN
exports.login = (req, res) => {
  try {

    const { email, password } = req.body

    // Find this user name
    User.findOne({ email }, 'email password')
      .then((user) => {

        // If User not found
        if (!user) {
          return res.status(401).send({ message: 'Wrong Email or Password' });
        }

        // Check if password matches
        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch) {
            // Password does not match
            return res.status(401).send({ message: 'Wrong Email or password' });
          }
          // Create a token
          const token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET_KEY, {
            expiresIn: '60 days',
          });
          // Set a cookie
          res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
          res.json({ message: 'Login Successful' })
        });
      })
      .catch((err) => {
        console.log(err);
      });

  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}


// SIGN UP
exports.signup = (req, res) => {
  // Create User
  const newuser = new User(req.body);

  User.findOne({ email: newuser.email })
    .then((user) => {
      // If user already exists return an error
      if (user) { return res.status(409).send({ err: 'Email already in use.' }) }
      // else save user and send token
      newuser
        .save()
        .then((user) => {
          const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '60 days' });
          res.cookie('nToken', token, { maxAge: 900000 });
          res.json({ user })
        })
        .catch((err) => {
          console.log(err.message);
          return res.status(400).send({ err });
        });
    })
    .catch((err) => {
      throw err
    })
}