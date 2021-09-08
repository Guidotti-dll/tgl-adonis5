import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

let method: boolean

export default class PermissionValidator {
  constructor(protected ctx: HttpContextContract) {
    method = ctx.route?.name?.split('.')[1] === 'attach'
  }

  public schema = schema.create({
    permissions: method
      ? schema.array.optional([rules.minLength(1), rules.distinct('*')]).members(
          schema.number([
            rules.exists({ table: 'permissions', column: 'id' }),
            rules.unique({
              table: 'role_permissions',
              column: 'permission_id',
            }),
          ])
        )
      : schema.array
          .optional([rules.minLength(1), rules.distinct('*')])
          .members(schema.number([rules.exists({ table: 'permissions', column: 'id' })])),
  })

  public messages = {
    required: 'The {{ field }} is required',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
    distinct: 'Some {{field}} is repeating itself',
    exists: 'The {{field}} does not exist in the permission table.',
    unique: 'The {{ field }} already exists in the role permission relation ',
  }
}
