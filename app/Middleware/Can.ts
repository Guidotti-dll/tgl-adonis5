import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WithoutPermissionException from 'App/Exceptions/WithoutPermissionException'

export default class Can {
  public async handle({ route, bouncer }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    let permission = false
    const routePermission = route?.name?.replace(/[_\.]/g, '-')
    if (await bouncer.allows('Can', routePermission || '')) {
      permission = true
    }
    if (!permission) {
      throw new WithoutPermissionException('', 403, 'E_AUTHORIZATION_FAILURE')
    }
    await next()
  }
}
