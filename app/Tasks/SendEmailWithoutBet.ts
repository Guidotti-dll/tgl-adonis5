import { BaseTask } from 'adonis5-scheduler/build'

export default class SendEmailWithoutBet extends BaseTask {
  public static get schedule() {
    return '30 * * * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    console.log('The answer to life, the universe, and everything!')
  }
}
