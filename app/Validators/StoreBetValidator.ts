import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreBetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    bets: schema.array().members(
      schema.object().members({
        game_id: schema.number([rules.exists({ table: 'games', column: 'id' })]),
        numbers: schema.array([rules.minLength(1)]).members(schema.number([rules.unsigned()])),
      })
    ),
  })

  public messages = {
    required: 'The {{ field }} is required',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
    unsigned: 'The {{field}} should be above {{options.unsigned}}.',
    number: 'The {{field}} should be a STRING.',
    exists: 'The {{field}} does not exist in the game table.',
  }
}
