import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class AdminPermitionSeeder extends BaseSeeder {
  public async run() {
    const role = await Role.findBy('slug', 'user')
    if (role) {
      await role?.related('permissions').attach([2, 3, 4, 5])
    }
  }
}
