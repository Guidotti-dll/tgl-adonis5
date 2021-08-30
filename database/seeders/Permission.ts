import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      {
        name: 'indexUser',
        slug: 'user-index',
      },
      {
        name: 'postUser',
        slug: 'user-post',
      },
      {
        name: 'showUser',
        slug: 'user-show',
      },
      {
        name: 'updateUser',
        slug: 'user-update',
      },
      {
        name: 'destroyUser',
        slug: 'user-destroy',
      },
    ])
  }
}
