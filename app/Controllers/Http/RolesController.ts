import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import PermissionValidator from 'App/Validators/PermissionValidator'
import StoreRoleValidator from 'App/Validators/StoreRoleValidator'
import UpdateRoleValidator from 'App/Validators/UpdateRoleValidator'

export default class RolesController {
  public async index({ request }: HttpContextContract) {
    const { page, perPage } = request.qs()
    const roles = await Role.query().preload('permissions').paginate(page, perPage)

    return roles
  }

  public async attach({ request, response, params }: HttpContextContract) {
    const { permissions } = await request.validate(PermissionValidator)
    try {
      const role = await Role.findBy('id', params.id)
      if (!role) {
        return response.status(404).send({ error: { message: 'Role not found' } })
      }
      await role!.load('permissions')
      if (permissions && permissions.length > 0) {
        permissions.forEach(async (permission) => {
          const has = role.permissions.some((rolePermission) => rolePermission.id === permission)
          if (!has) {
            await role!.related('permissions').attach([permission])
          }
        })

        await role!.load('permissions')
        return role
      }
    } catch (error) {
      response.badRequest({ error: { message: error.message } })
    }
  }

  public async detach({ request, response, params }: HttpContextContract) {
    const { permissions } = await request.validate(PermissionValidator)
    try {
      const role = await Role.findBy('id', params.id)
      if (!role) {
        return response.status(404).send({ error: { message: 'Role not found' } })
      }
      await role.load('permissions')
      if (permissions && permissions.length > 0) {
        permissions.forEach(async (permission) => {
          const has = role.permissions.some((rolePermission) => rolePermission.id === permission)
          if (has) {
            await role!.related('permissions').detach([permission])
          }
        })
        await role.load('permissions')
        return role
      }
    } catch (error) {
      response.badRequest({ error: { message: error.message } })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const { name, slug, permissions } = await request.validate(StoreRoleValidator)
    try {
      const role = await Role.create({ name, slug })

      if (permissions && permissions.length > 0) {
        await role.related('permissions').attach(permissions)
        await role.load('permissions')
      }

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
    await role.load('permissions')
    return role
  }

  public async update({ request, response, params }: HttpContextContract) {
    const { name, slug, permissions } = await request.validate(UpdateRoleValidator)
    try {
      const role = await Role.findBy('id', params.id)
      if (!role) {
        return response.status(404).send({ error: { message: 'Role not found' } })
      }
      role.merge({
        name,
        slug,
      })

      if (permissions && permissions.length > 0) {
        await role!.related('permissions').sync(permissions)

        await role.load('permissions')
      }

      await role.save()

      return role
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
