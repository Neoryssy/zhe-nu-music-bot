import { serverIO } from '../../server'
import discordClient from '../../../bot/discordClient'

export class QueueSocketEmitter {
  public static emitQueue = async (guildId: string) => {
    const guild = discordClient.guilds.cache.get(guildId)

    if (!guild) {
      serverIO.emit(`queue:${guildId}`, [])
      return
    }

    const dispatcher = discordClient.subscription.get(guildId)

    if (!dispatcher) {
      serverIO.emit(`queue:${guildId}`, [])
      return
    }

    const queue = dispatcher.queue

    serverIO.emit(`queue:${guildId}`, queue)
  }
}
