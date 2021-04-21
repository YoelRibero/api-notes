const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  // Get Authorization
  const authorization = req.get('authorization')
  let token = null

  // Evaluate authorization and get token
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }
 
  // Decoded token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  // Token or decodedNoken is missing print error
  if (!token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  // Get userId from decodedToken
  const { id: userId } = decodedToken
  req.userId = userId
  next()
}