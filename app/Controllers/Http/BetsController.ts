import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'

export default class BetsController {
  public async index({ request, auth }: HttpContextContract) {
    const { page, perPage } = request.qs()

    if (auth.user!.roles[0].slug !== 'admin') {
      const bets = await Bet.query().preload('game').paginate(page, perPage)
      return bets
    }
    const bets = await Bet.query()
      .where('user_id', auth.user!.id)
      .preload('game')
      .paginate(page, perPage)

    return bets
  }

  public async store({}: HttpContextContract) {}

  public async show({ params, response, auth }: HttpContextContract) {
    const bet = await Bet.findBy('id', params.id)

    if (!bet) {
      return response.status(404).send({ error: { message: 'Bet not found' } })
    }

    if (
      !auth.user!.bets.some((userBet) => userBet.id === bet.id) &&
      auth.user?.roles[0].slug !== 'admin'
    ) {
      return response.status(401).send({ error: { message: 'You can only show your own bet' } })
    }

    return bet
  }

  public async update({}: HttpContextContract) {}

  public async destroy({ params, response, auth }: HttpContextContract) {
    const bet = await Bet.findBy('id', params.id)

    if (!bet) {
      return response.status(404).send({ error: { message: 'Bet not found' } })
    }

    if (
      !auth.user!.bets.some((userBet) => userBet.id === bet.id) &&
      auth.user?.roles[0].slug !== 'admin'
    ) {
      return response.status(401).send({ error: { message: 'You can only delete your own bet' } })
    }
    await bet.delete()
    return response.status(200).send({ deleted: true })
  }
}
