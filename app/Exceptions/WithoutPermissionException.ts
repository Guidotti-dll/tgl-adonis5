import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WithoutPermissionException extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    if (error.code === 'E_AUTHORIZATION_FAILURE') {
      return ctx.response
        .status(error.status || 403)
        .send({ message: "You don't have permission to access this route" })
    }
    return ctx.response.status(error.status).send(error.message)
  }
}
