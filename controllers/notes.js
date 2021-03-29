const notesRouter = require('express').Router()

const { app } = require('..')
const Note = require('../models/Note')

// get all notes
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

// get single note
notesRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const note = await Note.findById(id)
    res.json(note)
  } catch(e) {
    console.error(e)
    res.status(404).end()
  }
})

// update note
notesRouter.put('/:id', async (req, res, next) => {
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
notesRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    await Note.findByIdAndRemove(id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

// create note
notesRouter.post('/', async (req, res, next) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'Note content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important  : false,
    date: new Date().toISOString()
  })

  try {
    const savedNote = await newNote.save()
    res.json(savedNote)
  } catch(e) {
    next(e)
  }
})

module.exports = notesRouter
