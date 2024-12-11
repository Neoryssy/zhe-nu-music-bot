import { serverIO } from '../../server'
import discordClient from '../../../bot/discordClient'

export class PlayerSocketEmitter {
  public static emitPlayer = async (guildId: string) => {
    const dispatcher = discordClient.subscription.get(guildId)

    const player = {
      duration: dispatcher?.duration || 0,
      isLooping: false,
      isMuted: false,
      isPlaying: !!dispatcher?.isPlaying,
      isShuffled: false,
      position: dispatcher?.position || 0,
      track: dispatcher?.current || null,
    }

    serverIO.emit(`player:${guildId}`, player)
  }

  public static emitPlayerisPlaying = async (guildId: string) => {
    const dispatcher = discordClient.subscription.get(guildId)

    if (!dispatcher) {
      return
    }

    serverIO.emit(`player:${guildId}:isPlaying`, dispatcher.isPlaying)
  }

  public static emitPlayerPosition = async (guildId: string) => {
    const dispatcher = discordClient.subscription.get(guildId)
    if (!dispatcher) {
      return
    }

    serverIO.emit(`player:${guildId}:position`, dispatcher.position)
  }
}
