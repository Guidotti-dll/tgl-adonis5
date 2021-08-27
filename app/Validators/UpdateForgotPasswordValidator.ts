import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string({}, [
      rules.minLength(8),
      rules.maxLength(60),
      rules.confirmed(),
      rules.required(),
    ]),
  })

  public messages = {
    required: 'The {{ field }} is required',
    confirmed: 'The {{field}} confirmation does not match.',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
    maxLength: 'The {{field}} should not be more than {{options.maxLength}}.',
  }
}
