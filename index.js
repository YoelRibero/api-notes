const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')

app.use(express.json())
app.use(cors())
app.use(logger)

let notes = [
  {
    id: 1,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla malesuada sagittis euismod. In sit amet ex mauris.",
    date: "2019-05-30T17:38:31.098z",
    important: true,
  },
  {
    id: 2,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla malesuada sagittis euismod. In sit amet ex mauris.",
    date: "2019-05-30T18:39:34.091z",
    important: false,
  },
  {
    id: 3,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla malesuada sagittis euismod. In sit amet ex mauris.",
    date: "2019-05-30T19:28:14.298z",
    important: true,
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})
