import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StorePermissionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.required()]),
    slug: schema.string({}, [
      rules.required(),
      rules.unique({ table: 'permissions', column: 'slug' }),
    ]),
  })

  public messages = {
    required: 'The {{ field }} is required',
    unique: 'The {{ field }} not available',
  }
}
