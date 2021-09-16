import test from 'japa'
import User from 'App/Models/User'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create User', (group) => {
  group.beforeEach(async () => {
    const users = await User.all()
    users.forEach(async (user) => {
      if (user.id !== 1) await user.delete()
    })
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
})
