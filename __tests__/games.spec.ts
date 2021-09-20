import test from 'japa'
import supertest from 'supertest'
import { DestroyUsers } from './utils/destroyUsers'

const BASE_URL = process.env.APP_URL

async function logWithAdmin() {
  const {
    body: { token },
  } = await supertest(BASE_URL).post('/sessions').send({
    email: 'admin@root.com',
    password: '12345678',
  })

  return token
}

test.group('Game', (group) => {
  group.beforeEach(async () => {
    await DestroyUsers()
  })
  test('Create game with admin user', async (assert) => {
    const token = await logWithAdmin()
    const { body } = await supertest(BASE_URL)
      .post('/games')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'Teste',
        description:
          'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
        range: 25,
        price: 2.5,
        color: '#7d3992',
        max_number: 15,
        min_cart_value: 30.0,
      })

    assert.exists(body.id)
  })

  test('Show first game with admin user', async (assert) => {
    const token = await logWithAdmin()
    const { body } = await supertest(BASE_URL)
      .get('/games/1')
      .set('Authorization', `Bearer ${token}`)

    assert.equal(body.id, 1)
  })

  test('Index games with admin user', async (assert) => {
    const token = await logWithAdmin()
    const { body } = await supertest(BASE_URL).get('/games').set('Authorization', `Bearer ${token}`)

    assert.exists(body.data)
  })
})
