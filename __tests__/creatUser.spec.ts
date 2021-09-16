import test from 'japa'
import User from 'App/Models/User'
import { JSDOM } from 'jsdom'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create User', () => {
  test('ensure user password gets hashed during save', async (assert) => {
    const user = await supertest(BASE_URL).post('/users').send({
      name: 'Lucas',
      email: 'lucas@email.com',
      password: '12345678',
    })

    console.log('aaa', user)

    // assert.notEqual(user.body, 'secret')
  })
})
