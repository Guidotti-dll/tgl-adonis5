import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Permission from './Permission'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Permission, {
    pivotForeignKey: 'role_id',
    pivotTable: 'role_permissions',
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  })
  public permissions: ManyToMany<typeof Permission>
}
