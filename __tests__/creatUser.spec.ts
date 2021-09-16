import test from 'japa'
import User from 'App/Models/User'
import { JSDOM } from 'jsdom'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create User', () => {
  test('create user and return your id', async (assert) => {
    const { body } = await supertest(BASE_URL).post('/users').send({
      name: 'Lucas',
      email: 'lucas@email.com',
      password: '12345678',
      password_confirmation: '12345678',
    })

    console.log(body)

    assert.exists(body.id)
  })
})
