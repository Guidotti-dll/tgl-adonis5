import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreForgotPasswordValidator from 'App/Validators/StoreForgotPasswordValidator'
import crypto from 'crypto'

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const { email, redirect_url: redirectUrl } = await request.validate(
        StoreForgotPasswordValidator
      )

      const user = await User.findBy('email', email)

      if (!user) {
        return response.notFound({ error: { message: 'User not found' } })
      }

      user.reset_token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await Mail.sendLater((message) => {
        message
          .from('tgl@email.com')
          .to(user.email)
          .subject('Forgot Password')
          .htmlView('emails/forgot_password', {
            name: user.name,
            email: user.email,
            token: user.reset_token,
            link: `${redirectUrl}?token=${user.reset_token}`,
          })
      })

      await user.save()
    } catch (error) {
      return response.status(error.status).send({ error: { message: error.message } })
    }
  }

  public async update({}: HttpContextContract) {}
}
