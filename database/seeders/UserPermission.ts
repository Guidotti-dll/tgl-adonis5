import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class UserPermissionSeeder extends BaseSeeder {
  public async run() {
    const role = await Role.findBy('slug', 'user')
    await role?.load('permissions')
    if (role && role.permissions.length === 0) {
      await role?.related('permissions').attach([2, 3, 4, 5])
    }
  }
}
