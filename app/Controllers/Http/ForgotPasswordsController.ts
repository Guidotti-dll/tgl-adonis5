import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreForgotPasswordValidator from 'App/Validators/StoreForgotPasswordValidator'
import UpdateForgotPasswordValidator from 'App/Validators/UpdateForgotPasswordValidator'
import crypto from 'crypto'
import moment from 'moment'

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

      if (!user.is_confirmed) {
        return response.status(400).send({
          error: {
            message: 'To recover your password, you need to confirm your account, check your email',
          },
        })
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

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const { password } = await request.validate(UpdateForgotPasswordValidator)

      const token = params.token

      if (!token) {
        return response
          .status(400)
          .send({ error: { message: 'A token is required to reset the password' } })
      }

      const user = await User.findBy('reset_token', token)

      if (!user) {
        return response.status(400).send({ error: { message: 'Token invalid' } })
      }

      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({ error: { message: 'Recovery token is expired' } })
      }
      user.reset_token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      return response.status(error.status).send({ error: { message: error.message } })
    }
  }
}
