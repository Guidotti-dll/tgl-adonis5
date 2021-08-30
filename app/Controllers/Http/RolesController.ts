import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import StoreRoleValidator from 'App/Validators/StoreRoleValidator'

export default class RolesController {
  public async index({ request }: HttpContextContract) {
    const { page, perPage } = request.qs()
    const roles = await Role.query().paginate(page, perPage)

    return roles
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(StoreRoleValidator)
    try {
      const role = await Role.create(data)

      return role
    } catch (error) {
      response.badRequest({ error: { message: error.message } })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const role = await Role.findBy('id', params.id)
    if (!role) {
      return response.status(404).send({ error: { message: 'Role not found' } })
    }
    return role
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const data = await request.only(['name', 'slug'])
      const role = await Role.findBy('id', params.id)
      if (!role) {
        return response.status(404).send({ error: { message: 'Role not found' } })
      }

      role.merge(data)

      await role.save()
    } catch (error) {
      response.badRequest({ error: { message: error.message } })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const role = await Role.findBy('id', params.id)
    if (!role) {
      return response.status(404).send({ error: { message: 'Role not found' } })
    }

    await role.delete()
  }
}
