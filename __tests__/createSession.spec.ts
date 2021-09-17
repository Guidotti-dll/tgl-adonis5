import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create Session', () => {
  test('create user,init session and return token', async (assert) => {
    const user = await UserFactory.merge({
      is_confirmed: true,
      password: '12345678',
    }).create()

    const { body } = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '12345678',
    })

    assert.exists(body.token)
  })
})
