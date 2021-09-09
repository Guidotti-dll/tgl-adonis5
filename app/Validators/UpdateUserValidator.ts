import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [rules.maxLength(80)]),
    email: schema.string.optional({}, [
      rules.email(),
      rules.maxLength(254),
      rules.unique({
        table: 'users',
        column: 'email',
        whereNot: {
          id: this.ctx.params.id,
        },
      }),
    ]),
    password: schema.string.optional({}, [
      rules.minLength(8),
      rules.maxLength(60),
      rules.confirmed(),
    ]),
  })

  public messages = {
    unique: 'The {{ field }} not available',
    email: 'The {{field}} should be a valid email address',
    confirmed: 'The {{field}} confirmation does not match.',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
    maxLength: 'The {{field}} should not be more than {{options.maxLength}}.',
  }
}
