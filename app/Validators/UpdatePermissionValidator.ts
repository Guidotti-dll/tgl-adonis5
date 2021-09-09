import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdatePermissionValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string.optional(),
    slug: schema.string.optional({}, [
      rules.unique({
        table: 'permissions',
        column: 'slug',
        whereNot: {
          id: this.ctx.params.id,
        },
      }),
    ]),
  })

  public messages = {
    unique: 'The {{ field }} not available',
  }
}
