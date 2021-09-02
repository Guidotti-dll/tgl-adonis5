import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateGameValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string.optional({}, [rules.unique({ table: 'games', column: 'type' })]),
    description: schema.string.optional(),
    color: schema.string.optional({}, [
      rules.minLength(4),
      rules.maxLength(7),
      rules.regex(/^#([0-9a-fA-F]{6})$/),
    ]),
    range: schema.number.optional([rules.unsigned()]),
    price: schema.number.optional([rules.unsigned()]),
    max_number: schema.number.optional([rules.unsigned()]),
    min_cart_value: schema.number.optional([rules.unsigned()]),
  })

  public messages = {
    unique: 'The {{ field }} not available',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
    maxLength: 'The {{field}} should not be more than {{options.maxLength}}.',
    unsigned: 'The {{field}} should be above {{options.unsigned}}.',
    regex: 'The {{field}} format is invalid.',
    string: 'The {{field}} should be a STRING.',
    number: 'The {{field}} should be a STRING.',
  }
}
