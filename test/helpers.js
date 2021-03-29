const supertest = require('supertest')
const { app } = require('../index')

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

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes
}
