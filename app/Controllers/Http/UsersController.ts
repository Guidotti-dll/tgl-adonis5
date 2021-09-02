import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import StoreUserValidator from 'App/Validators/StoreUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ request }: HttpContextContract) {
    const { page, perPage } = request.qs()
    const users = await User.query().paginate(page, perPage)

    return users
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(StoreUserValidator)
      const user = await User.create(data)
      const role = await Role.findBy('slug', 'user')
      if (role) {
        await user.related('roles').attach([role.id])
      }

      Mail.sendLater((message) => {
        message
          .from('tgl@email.com')
          .to(user.email)
          .subject('Welcome')
          .htmlView('emails/confirmation_account', {
            name: user.name,
            link: `${Env.get('APP_URL')}/confirm-account/${user.id}`,
          })
      })

      return user
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({ params, response, auth }: HttpContextContract) {
    const user = await User.findBy('id', params.id)

    if (!user) {
      return response.status(404).send({ error: { message: 'User not found' } })
    }

    if (user.id !== auth.user!.id && auth.user?.roles[0].slug !== 'admin') {
      return response.status(401).send({ error: { message: 'You can only show your own account' } })
    }

    return user
  }

  public async update({ request, params, auth, response }: HttpContextContract) {
    const user = await User.findByOrFail('id', params.id)
    const data = await request.validate(UpdateUserValidator)

    if (user.id !== auth.user!.id && auth.user?.roles[0].slug !== 'admin') {
      return response
        .status(401)
        .send({ error: { message: 'You can only update your own account' } })
    }

    user.merge(data)

    await user.save()

    return user
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const user = await User.findBy('id', params.id)

    if (!user) {
      return response.status(404).send({ error: { message: 'User not found' } })
    }

    if (user.id !== auth.user!.id && auth.user?.roles[0].slug !== 'admin') {
      return response
        .status(401)
        .send({ error: { message: 'You can only delete your own account' } })
    }
    await user.delete()
    return response.status(200).send({ deleted: true })
  }
}
