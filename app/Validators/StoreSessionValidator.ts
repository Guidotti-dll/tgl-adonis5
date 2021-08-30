import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreSessionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.required()]),
    password: schema.string({}, [rules.minLength(8), rules.required()]),
  })

  public messages = {
    required: 'The {{ field }} is required',
    email: 'The {{field}} should be a valid email address',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
  }
}
