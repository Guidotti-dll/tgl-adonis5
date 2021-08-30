import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreSessionValidator from 'App/Validators/StoreSessionValidator'

export default class SessionsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = await request.validate(StoreSessionValidator)
    try {
      const { user, token } = await auth
        .use('api')
        .attempt(email, password, { expiresIn: '60mins' })
      return { user, token }
    } catch {
      return response.badRequest({ error: { message: 'Invalid credentials' } })
    }
  }

  public async confirmAccount({ params, response }: HttpContextContract) {
    try {
      const user = await User.findBy('id', params.id)
      if (!user) {
        return response.status(404).send({ error: { message: 'User not found' } })
      }
      if (user && user.is_confirmed) {
        return response
          .status(400)
          .send({ error: { message: 'This account is already confirmed' } })
      }

      user.is_confirmed = true
      user.save()

      return response.status(200).redirect('http://localhost:3000?confirm=true')
    } catch (error) {
      return response.status(error.status).send({ error: { message: error.message } })
    }
  }
}
