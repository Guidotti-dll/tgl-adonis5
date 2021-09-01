import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    const permissions = await Permission.all()
    if (permissions.length === 0) {
      await Permission.createMany([
        {
          name: 'indexUser',
          slug: 'users-index',
        },
        {
          name: 'storeUser',
          slug: 'users-store',
        },
        {
          name: 'showUser',
          slug: 'users-show',
        },
        {
          name: 'updateUser',
          slug: 'users-update',
        },
        {
          name: 'destroyUser',
          slug: 'users-destroy',
        },
        {
          name: 'indexRole',
          slug: 'roles-index',
        },
        {
          name: 'storeRole',
          slug: 'roles-store',
        },
        {
          name: 'showRole',
          slug: 'roles-show',
        },
        {
          name: 'updateRole',
          slug: 'roles-update',
        },
        {
          name: 'destroyRole',
          slug: 'roles-destroy',
        },
        {
          name: 'indexPermission',
          slug: 'permissions-index',
        },
        {
          name: 'storePermission',
          slug: 'permissions-store',
        },
        {
          name: 'showPermission',
          slug: 'permissions-show',
        },
        {
          name: 'updatePermission',
          slug: 'permissions-update',
        },
        {
          name: 'destroyPermission',
          slug: 'permissions-destroy',
        },
      ])
    }
  }
}
