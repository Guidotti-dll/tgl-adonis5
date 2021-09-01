import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in dev mode and seeder is development
     * only
     */
    if (seeder.default.developmentOnly && !Application.inDev) {
      return
    }

    await new seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../Permission'))
    await this.runSeeder(await import('../Role'))
    await this.runSeeder(await import('../AdminPermission'))
    await this.runSeeder(await import('../UserPermission'))
    await this.runSeeder(await import('../Game'))
    await this.runSeeder(await import('../Admin'))
  }
}
