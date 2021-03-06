const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { server } = require('../index')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({
      username: 'yoribero',
      passwordHash
    })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'YoelRibero',
      name: 'Yoel',
      password: 'hol4'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)

    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if user is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'yoribero',
      name: 'Yoel',
      password: 'hol4'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.errors.username.message).toContain('`username` to be unique')
    
    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
