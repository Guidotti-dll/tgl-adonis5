/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import StoreBetValidator from 'App/Validators/StoreBetValidator'
import UpdateBetValidator from 'App/Validators/UpdateBetValidator'
import { DateTime } from 'luxon'

interface ReturnBet {
  id?: number
  user_id: number
  game_id: number
  price: number
  numbers: string
  color: string
  created_at: DateTime
  updated_at: DateTime
}

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

  public async store({ request, response, auth }: HttpContextContract) {
    const { bets } = await request.validate(StoreBetValidator)
    const newBets: ReturnBet[] = []
    let minCartValue = 0
    let totalCartPrice = 0

    const trx = await Database.transaction()
    for (const bet of bets) {
      const game = await Game.find(bet.game_id)
      if (bet.numbers.length !== game!['max_number']) {
        return response.status(400).send({
          error: { message: "Some of your bets doesn't have the correct amount of numbers" },
        })
      }
      totalCartPrice += game!.price
      if (minCartValue < game!['min_cart_value']) {
        minCartValue = game!['min_cart_value']
      }

      const data = {
        game_id: game!.id,
        user_id: auth.user!.id,
        price: game!.price,
        numbers: bet.numbers.join(','),
      }

      const { user_id, created_at, updated_at, price, numbers, game_id } = await Bet.create(
        data,
        trx
      )

      newBets.push({ user_id, game_id, created_at, updated_at, price, numbers, color: game!.color })
    }

    if (totalCartPrice < minCartValue) {
      return response.status(400).send({
        error: {
          message: `The value of your cart is less than the minimum accepted, $${minCartValue} `,
        },
      })
    }

    await trx.commit()

    return newBets
  }

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

  public async update({ response, request, params }: HttpContextContract) {
    const { game_id, numbers } = await request.validate(UpdateBetValidator)

    const bet = await Bet.findBy('id', params.id)
    if (!bet) {
      return response.status(404).send({ error: { message: 'Bet not found' } })
    }

    const game = await Game.find(game_id)
    if (numbers && numbers.length !== game!['max_number']) {
      return response
        .status(400)
        .send({ error: { message: "Your bet doesn't have the correct amount of numbers" } })
    }

    bet.merge({
      game_id,
      price: game!.price,
      numbers: numbers ? numbers.join(',') : bet.numbers,
    })
    await bet.save()
    return { ...bet.$attributes, color: game!.color }
  }

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
