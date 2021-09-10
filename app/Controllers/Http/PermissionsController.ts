import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import StorePermissionValidator from 'App/Validators/StorePermissionValidator'
import UpdatePermissionValidator from 'App/Validators/UpdatePermissionValidator'

export default class PermissionsController {
  public async index({ request }: HttpContextContract) {
    const { page, perPage } = request.qs()
    const permissions = await Permission.query().paginate(page, perPage)

    return permissions
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(StorePermissionValidator)
    try {
      const permission = await Permission.create(data)

      return permission
    } catch (error) {
      response.badRequest({ error: { message: error.message } })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const permission = await Permission.findBy('id', params.id)
    if (!permission) {
      return response.status(404).send({ error: { message: 'Permission not found' } })
    }
    return permission
  }

  public async update({ request, response, params }: HttpContextContract) {
    const data = await request.validate(UpdatePermissionValidator)
    try {
      const permission = await Permission.findBy('id', params.id)
      if (!permission) {
        return response.status(404).send({ error: { message: 'Permission not found' } })
      }

      permission.merge(data)

      await permission.save()

      return permission
    } catch (error) {
      response.badRequest({ error: { message: error.message } })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const permission = await Permission.findBy('id', params.id)
    if (!permission) {
      return response.status(404).send({ error: { message: 'Permission not found' } })
    }

    await permission.delete()
  }
}
