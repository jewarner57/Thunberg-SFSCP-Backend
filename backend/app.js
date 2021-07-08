require("dotenv").config();
const express = require('express')
const cookieParser = require('cookie-parser')
const isAuth = require('./middleware/isAuth')

// Require database configuration
const connectDB = require('./data/db')

const mainRoutes = require('./routes/main')
const authRoutes = require('./routes/auth')
const app = express()
const cors = require('cors');

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(cors());
// app.use(isAuth())

// Routes
app.use(authRoutes)
app.use(mainRoutes)

// connectDB()
const run = async () => {
  // Connect to Mongoose database. Connection code in data/db.js
  await connectDB()
  await app.listen(5000)
}

run()

module.exports = app