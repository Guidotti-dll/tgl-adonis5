import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreUserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string({}, [rules.maxLength(80), rules.required()]),
    email: schema.string({}, [
      rules.email(),
      rules.maxLength(254),
      rules.required(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [
      rules.minLength(8),
      rules.maxLength(60),
      rules.confirmed(),
      rules.required(),
    ]),
  })
  public messages = {
    required: 'The {{ field }} is required',
    unique: 'The {{ field }} not available',
    email: 'The {{field}} should be a valid email address',
    confirmed: 'The {{field}} confirmation does not match.',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
    maxLength: 'The {{field}} should not be more than {{options.maxLength}}.',
  }
}
