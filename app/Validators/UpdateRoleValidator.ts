import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateRoleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional(),
    slug: schema.string.optional({}, [
      rules.unique({
        table: 'roles',
        column: 'slug',
        whereNot: {
          id: this.ctx.params.id,
        },
      }),
    ]),
    permissions: schema.array.optional([rules.minLength(1)]).members(schema.number()),
  })

  public messages = {
    required: 'The {{ field }} is required',
    unique: 'The {{ field }} not available',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
  }
}
