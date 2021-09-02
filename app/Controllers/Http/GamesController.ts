import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import StoreGameValidator from 'App/Validators/StoreGameValidator'
import UpdateGameValidator from 'App/Validators/UpdateGameValidator'

export default class GamesController {
  public async index({ request }: HttpContextContract) {
    const { page, perPage } = request.qs()
    const games = await Game.query().paginate(page, perPage)

    return games
  }

  public async store({ response, request }: HttpContextContract) {
    const data = await request.validate(StoreGameValidator)
    try {
      const game = await Game.create(data)

      return game
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({ response, params }: HttpContextContract) {
    const game = await Game.findBy('id', params.id)

    if (!game) {
      return response.status(404).send({ error: { message: 'Game not found' } })
    }

    return game
  }

  public async update({ params, request, response }: HttpContextContract) {
    const game = await Game.findBy('id', params.id)
    const data = await request.validate(UpdateGameValidator)

    if (!game) {
      return response.status(404).send({ error: { message: 'Game not found' } })
    }

    await game.merge(data)
    await game.save()
    return game
  }

  public async destroy({ response, params }: HttpContextContract) {
    const game = await Game.findBy('id', params.id)

    if (!game) {
      return response.status(404).send({ error: { message: 'Game not found' } })
    }

    await game.delete()
    return response.status(200).send({ deleted: true })
  }
}
