// Import bcrypt module
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
  const { body } = req
  const { username, password } = body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'invalid user or password'
    })
  }

  // PAYLOAD
  const userForToken = {
    id: user._id,
    username: user.username
  }

  // Sign Token
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    {
      expiresIn: 60 * 60 * 24 * 7
    }  
  )

  // return token too
  res.send({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = loginRouter
