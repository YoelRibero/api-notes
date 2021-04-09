const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Learning Test with jest',
    important: true,
    date: new Date()  
  },
  {
    content: 'Also Learning node with express',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
  return {
    contents,
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getUsers,
  getAllContentFromNotes
}
