import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const roles = await Role.all()
    if (roles.length === 0) {
      await Role.createMany([
        {
          name: 'player',
          slug: 'player',
        },
        {
          name: 'admin',
          slug: 'admin',
        },
      ])
    }
  }
}
