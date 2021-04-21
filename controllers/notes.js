const notesRouter = require('express').Router()

const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middlewares/userExtractor')

// get all notes
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.json(notes)
})

// get single note
notesRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const note = await Note.findById(id).populate('user', {
      username: 1,
      name: 1
    })
    res.json(note)
  } catch(e) {
    console.error(e)
    res.status(404).end()
  }
})

// update note
notesRouter.put('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  try {
    const newNoteUpdated = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    res.json(newNoteUpdated)
  } catch (e) {
    next(e)
  }
})

// delete note
notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params

  try {
    await Note.findByIdAndRemove(id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

// create note
notesRouter.post('/', userExtractor, async (req, res, next) => {
  const { 
    content, 
    important = false
  } = req.body

  // Get userId from request
  const { userId } = req

  const user = await User.findById(userId)

  if (!content || !userId) {
    return res.status(400).json({
      error: 'Note content or userId is missing'
    })
  }

  const newNote = new Note({
    content,
    important,
    date: new Date().toISOString(),
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    // add note to user in db
    user.notes = [...user.notes, savedNote._id]
    await user.save()

    res.json(savedNote)
  } catch(e) {
    next(e)
  }
})

module.exports = notesRouter
