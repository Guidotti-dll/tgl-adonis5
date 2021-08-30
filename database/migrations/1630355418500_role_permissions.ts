import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RolePermissions extends BaseSchema {
  protected tableName = 'role_permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('permission_id')
        .unsigned()
        .references('permissions.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .integer('role_id')
        .unsigned()
        .references('roles.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.unique(['permission_id', 'role_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
