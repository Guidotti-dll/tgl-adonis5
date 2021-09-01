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
  public 'max-number': number

  @column()
  public 'min-cart-value': number

  @column()
  @column.dateTime({ autoCreate: true })
  public 'created-at': DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public 'updated-at': DateTime
}
