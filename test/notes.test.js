const mongoose = require('mongoose')

const Note = require('../models/Note')
const { server } = require('../index')
const { initialNotes, api, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  // sequential
  for (const note of initialNotes) {
    const notesObject = new Note(note)
    await notesObject.save()
  }
})

describe('GET Test', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test(`there are ${initialNotes.length} notes`, async () => {
    const { response: { body } } = await getAllContentFromNotes()
    expect(body).toHaveLength(initialNotes.length)
  })

  test('the some note is about learn test', async () => {
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain('Learning Test with jest')
  })

  test('a note is in the collection', async () => {
    const { contents, response: { body } } = await getAllContentFromNotes()
    const firstInitialNote = initialNotes[0]
    await api
      .get(`/api/notes/${body[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    expect(contents).toContain(firstInitialNote.content)
  })

  test('a note don\'t show if don\'t exist', async () => {
    await api
      .get('/api/notes/1233456')
      .expect(404)
  })
})

describe('PUT Test', () => {
  test('a valid note can be updated', async () => {
    const updateNote = {
      content: 'New content updated',
      important: true
    }

    const { response: { body } } = await getAllContentFromNotes()
    const noteToUpdate = body[0].id

    await api
      .put(`/api/notes/${noteToUpdate}`)
      .send(updateNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    // check update note
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain(updateNote.content)
  })

  test('a note don\'t exist can\'t be updated', async () => {
    const contentUpdate = {
      content: 'New Content update'
    }
    await api
      .put('/api/notes/123456789')
      .send(contentUpdate)
      .expect(400)
    
    const { contents, response: { body } } = await getAllContentFromNotes()
    expect(contents).toContain(body[0].content)
    expect(contents).not.toContain(contentUpdate.content)
  })
})

describe('DELETE Test', () => {
  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const noteToDelete = firstResponse.body[0]
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)
    
    const { contents, response: secondResponse } = await getAllContentFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.content)
  })

  test('a note that don\'t exist can\'t be deleted', async () => {
    await api
      .delete('/api/notes/12345')
      .expect(400)
    
    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('POST Test', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'New Note Added',
      important: false
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    // check created note
    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('note without content is not added', async () => {
    const newNote = {
      important: false
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
    
    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
