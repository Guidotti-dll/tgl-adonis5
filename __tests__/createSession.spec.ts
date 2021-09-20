import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import { DestroyUsers } from './utils/destroyUsers'
const BASE_URL = process.env.APP_URL

test.group('Create Session', (group) => {
  group.beforeEach(async () => {
    DestroyUsers()
  })

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

  test('create user,init session with invalid credentials', async (assert) => {
    const user = await UserFactory.merge({
      is_confirmed: true,
      password: '12345678',
    }).create()

    const { status } = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '123123123',
    })

    assert.equal(status, 401)
  })

  test('create user,init session with user not confirmed', async (assert) => {
    const user = await UserFactory.merge({
      password: '12345678',
    }).create()

    const { status } = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '12345678',
    })

    assert.equal(status, 400)
  })
})
