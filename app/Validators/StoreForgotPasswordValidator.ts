import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.required()]),
    redirect_url: schema.string({}, [rules.url({ requireHost: false }), rules.required()]),
  })

  public messages = {
    required: 'The {{ field }} is required',
    email: 'The {{field}} should be a valid email address',
    url: 'The {{field}} should be a valid url.',
  }
}
