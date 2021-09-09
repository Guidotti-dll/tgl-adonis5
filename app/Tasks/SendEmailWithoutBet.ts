import Mail from '@ioc:Adonis/Addons/Mail'
import { BaseTask } from 'adonis5-scheduler/build'
import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import { compareAsc, differenceInCalendarWeeks } from 'date-fns'

interface UserObject {
  name: string
  email: string
}

export default class SendEmailWithoutBet extends BaseTask {
  public static get schedule() {
    return '* 9 * * 1'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    const users = await User.query().preload('bets')

    const usersIdle: UserObject[] = []
    users.forEach(({ bets, name, email }) => {
      if (bets.length === 0) {
        usersIdle.push({
          name,
          email,
        })
      } else {
        const lastBet: Bet = bets.sort((a, b) => {
          return compareAsc(a.created_at.toJSDate(), b.created_at.toJSDate())
        })[0]

        const weeks = differenceInCalendarWeeks(new Date(), lastBet.created_at.toJSDate())
        if (weeks >= 1) {
          usersIdle.push({
            name,
            email,
          })
        }
      }
    })

    usersIdle.forEach((user) => {
      Mail.sendLater((message) => {
        message
          .from('tgl@email.com')
          .to(user.email)
          .subject('Go back to bet')
          .htmlView('emails/back_to_bet.edge', {
            name: user.name,
          })
      })
    })
  }
}
