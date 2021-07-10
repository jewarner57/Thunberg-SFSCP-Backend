const jwt = require('jsonwebtoken')

module.exports = function isAuth(req, res, next) {

  // Get authToken cookie
  const authHeader = req.cookies.authToken
  if (!authHeader) {
    res.status(401)
    return res.json({ err: "User is not authenticated" })
  }

  // Decode the token
  const decodedToken = jwt.verify(authHeader, process.env.SECRET_KEY, { complete: true }) || {};

  // Set the current user
  req.user = decodedToken.payload;

  next();
}
