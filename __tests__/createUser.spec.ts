import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import { DestroyUsers } from './utils/destroyUsers'

const BASE_URL = process.env.APP_URL
test.group('Create User', (group) => {
  group.beforeEach(async () => {
    DestroyUsers()
  })

  test('create user and return your id', async (assert) => {
    const { body } = await supertest(BASE_URL).post('/users').send({
      name: 'Lucas',
      email: 'lucas@email.com',
      password: '12345678',
      password_confirmation: '12345678',
    })
    assert.exists(body.id)
  })

  test('create user with existing email', async (assert) => {
    const { status } = await supertest(BASE_URL).post('/users').send({
      name: 'Lucas',
      email: 'admin@root.com',
      password: '12345678',
      password_confirmation: '12345678',
    })
    assert.equal(status, 400)
  })

  test('comfirm account', async (assert) => {
    const user = await UserFactory.create()

    const { status } = await supertest(BASE_URL).get(`/confirm-account/${user.id}`)

    assert.equal(status, 200)
  })
})
