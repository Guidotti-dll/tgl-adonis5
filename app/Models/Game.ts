import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public 'id': number

  @column()
  public 'type': string

  @column()
  public 'description': string

  @column()
  public 'range': number

  @column()
  public 'price': number

  @column()
  public 'color': string

  @column()
  public 'max_number': number

  @column()
  public 'min_cart_value': number

  @column.dateTime({ autoCreate: true })
  public 'created_at': DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public 'updated_at': DateTime
}
