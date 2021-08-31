import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    const permissions = await Permission.all()
    if (permissions.length === 0) {
      await Permission.createMany([
        {
          name: 'indexUser',
          slug: 'user-index',
        },
        {
          name: 'storeUser',
          slug: 'user-store',
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
        {
          name: 'indexRole',
          slug: 'role-index',
        },
        {
          name: 'storeRole',
          slug: 'role-store',
        },
        {
          name: 'showRole',
          slug: 'role-show',
        },
        {
          name: 'updateRole',
          slug: 'role-update',
        },
        {
          name: 'destroyRole',
          slug: 'role-destroy',
        },
        {
          name: 'indexPermission',
          slug: 'permission-index',
        },
        {
          name: 'storePermission',
          slug: 'permission-store',
        },
        {
          name: 'showPermission',
          slug: 'permission-show',
        },
        {
          name: 'updatePermission',
          slug: 'permission-update',
        },
        {
          name: 'destroyPermission',
          slug: 'permission-destroy',
        },
      ])
    }
  }
}
