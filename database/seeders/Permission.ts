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
        {
          name: 'indexGames',
          slug: 'games-index',
        },
        {
          name: 'storeGames',
          slug: 'games-store',
        },
        {
          name: 'showGames',
          slug: 'games-show',
        },
        {
          name: 'updateGames',
          slug: 'games-update',
        },
        {
          name: 'destroyGames',
          slug: 'games-destroy',
        },
        {
          name: 'indexBets',
          slug: 'bets-index',
        },
        {
          name: 'storeBets',
          slug: 'bets-store',
        },
        {
          name: 'showBets',
          slug: 'bets-show',
        },
        {
          name: 'updateBets',
          slug: 'bets-update',
        },
        {
          name: 'destroyBets',
          slug: 'bets-destroy',
        },
        {
          name: 'indexAllBets',
          slug: 'bets-index-all',
        },
        {
          name: 'showAllUsers',
          slug: 'users-show-all',
        },
        {
          name: 'updateAllUsers',
          slug: 'users-update-all',
        },
        {
          name: 'destroyAllUsers',
          slug: 'users-destroy-all',
        },
      ])
    }
  }
}
