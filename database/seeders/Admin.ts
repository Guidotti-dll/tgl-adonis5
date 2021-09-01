import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    const users = await User.all()
    if (users.length === 0) {
      const user = await User.create({
        name: 'GameMaster',
        email: 'admin@root.com',
        password: '12345678',
        is_confirmed: true,
      })
      const adminRole = await Role.findBy('slug', 'admin')
      if (adminRole) {
        await user.related('roles').attach([adminRole.id])
      }
    }
  }
}
