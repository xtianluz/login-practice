const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwt_secret = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, jwt_secret)
    
    if (decodedToken) {
      next()
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    })
  }
}