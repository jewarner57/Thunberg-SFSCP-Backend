const express = require('express')
const cookieParser = require('cookie-parser')

// Require database configuration
const connectDB = require('./data/db')
const mainRoutes = require('./routes/main')
const app = express()
const cors = require('cors');

app.use(cookieParser())
app.use(cors());
app.use(mainRoutes)
// connectDB()
const run = async () => {
  // Connect to Mongoose database. Connection code in data/db.js
  await connectDB()
  await app.listen(5000)
}

run()

module.exports = app