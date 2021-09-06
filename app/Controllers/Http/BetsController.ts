/* eslint-disable @typescript-eslint/naming-convention */
import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
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
  type: string
  created_at: DateTime
  updated_at: DateTime
}

export default class BetsController {
  public async index({ request, auth, bouncer }: HttpContextContract) {
    const { page, perPage } = request.qs()
    let bets: ModelPaginatorContract<Bet>
    if (await bouncer.allows('Can', 'bets-index-all')) {
      bets = await Bet.query().paginate(page, perPage)
    } else {
      bets = await Bet.query()
        .where('user_id', auth.user!.id)
        .preload('game')
        .paginate(page, perPage)
    }

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

      if (bet.numbers.some((number) => number > game!.range || number < 1)) {
        return response
          .status(400)
          .send({ error: { message: 'Any number is outside the allowed range' } })
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

      newBets.push({
        user_id,
        game_id,
        created_at,
        updated_at,
        price,
        numbers,
        color: game!.color,
        type: game!.type,
      })
    }

    if (totalCartPrice < minCartValue) {
      return response.status(400).send({
        error: {
          message: `The value of your cart is less than the minimum accepted, $${minCartValue} `,
        },
      })
    }

    await trx.commit()

    Mail.sendLater((message) => {
      message
        .from('tgl@email.com')
        .to(auth.user!.email)
        .subject('New Bet')
        .htmlView('emails/new_bets', {
          bets: newBets,
          name: auth.user!.name,
        })
    })

    return newBets
  }

  public async show({ params, response, auth, bouncer }: HttpContextContract) {
    const bet = await Bet.findBy('id', params.id)

    if (!bet) {
      return response.status(404).send({ error: { message: 'Bet not found' } })
    }

    if (auth.user!.id !== bet.user_id && !(await bouncer.allows('Can', 'bets-show-all'))) {
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

    await bet.load('game')

    if (numbers && numbers.some((number) => number > bet.game.range || number < 1)) {
      return response
        .status(400)
        .send({ error: { message: 'Any number is outside the allowed range' } })
    }

    const game = await Game.find(game_id ? game_id : bet.game_id)
    if (numbers && numbers.length !== game!['max_number']) {
      return response
        .status(400)
        .send({ error: { message: "Your bet doesn't have the correct amount of numbers" } })
    }

    bet.merge({
      game_id: game_id ? game_id : bet.game_id,
      price: game!.price,
      numbers: numbers ? numbers.join(',') : bet.numbers,
    })
    await bet.save()
    return { ...bet.$attributes, color: game!.color, type: game!.type }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const bet = await Bet.findBy('id', params.id)

    if (!bet) {
      return response.status(404).send({ error: { message: 'Bet not found' } })
    }

    await bet.delete()
    return response.status(200).send({ deleted: true })
  }
}
