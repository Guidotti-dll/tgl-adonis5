import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'

export default class AdminPermissionSeeder extends BaseSeeder {
  public async run() {
    const role = await Role.findBy('slug', 'admin')
    const permissions = await (await Permission.all()).map((permission) => permission.id)

    if (role) {
      await role?.related('permissions').attach(permissions)
    }
  }
}
