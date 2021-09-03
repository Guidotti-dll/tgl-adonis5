import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateBetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    game_id: schema.number.optional([rules.exists({ table: 'games', column: 'id' })]),
    numbers: schema.array.optional([rules.minLength(1)]).members(schema.number([rules.unsigned()])),
  })

  public messages = {
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
    unsigned: 'The {{field}} should be above {{options.unsigned}}.',
    number: 'The {{field}} should be a STRING.',
    exists: 'The {{field}} does not exist in the game table.',
  }
}
