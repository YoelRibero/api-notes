// import dotenv module
require('dotenv').config()
// import mongo connection
require('./mongo')
// import modules
const express = require('express')
const app = express()
const cors = require('cors')

const notesRouter = require('./controllers/notes')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')


app.use(express.json())
app.use(cors())

// App root
app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

// Notes Route
app.use('/api/notes', notesRouter)

// Middlewares for handle errors
app.use(notFound)
app.use(handleErrors)

// Port from environment var
const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})

// export app
module.exports = { app, server }
