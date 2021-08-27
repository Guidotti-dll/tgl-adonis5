import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreUserValidator from 'App/Validators/StoreUserValidator'

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

      return user
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const user = await User.findBy('id', params.id)
    if (!user) {
      return response.status(404).send({ error: { message: 'User not found' } })
    }
    return user
  }

  public async update({ request, params }: HttpContextContract) {
    const user = await User.findByOrFail('id', params.id)
    const data = await request.only(['username', 'email'])

    await user.merge(data).save()

    return user
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const user = await User.findBy('id', params.id)

    if (!user) {
      return response.status(404).send({ error: { message: 'User not found' } })
    }

    if (user.id !== auth.user!.id) {
      return response
        .status(401)
        .send({ error: { message: 'You can only delete your own account' } })
    }
    await user.delete()
    return response.status(200).send({ deleted: true })
  }
}