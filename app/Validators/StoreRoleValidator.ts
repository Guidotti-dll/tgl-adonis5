import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreRoleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.required()]),
    slug: schema.string({}, [rules.required(), rules.unique({ table: 'roles', column: 'slug' })]),
    permissions: schema.array.optional([rules.minLength(1)]).members(schema.number()),
  })

  public messages = {
    required: 'The {{ field }} is required',
    unique: 'The {{ field }} not available',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
  }
}
