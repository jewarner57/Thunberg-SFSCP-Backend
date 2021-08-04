require("dotenv").config();
const express = require('express')
const cookieParser = require('cookie-parser')

// Require database configuration
const connectDB = require('./data/db')

const mainRoutes = require('./routes/main')
const authRoutes = require('./routes/auth')
const riderRideRoutes = require('./routes/riderRides')
const driverRideRoutes = require('./routes/driverRides')
const app = express()
const cors = require('cors');

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(cors());

// Routes
app.use(mainRoutes)
app.use('/user', authRoutes)
app.use('/rides/rider', riderRideRoutes)
app.use('/rides/driver', driverRideRoutes)

// connectDB()
const run = async () => {
  // Connect to Mongoose database. Connection code in data/db.js
  await connectDB()
  await app.listen(process.env.PORT)
}

run()

module.exports = app