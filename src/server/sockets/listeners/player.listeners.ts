import { Socket } from 'socket.io'
import discordClient from '../../../bot/discordClient'
import { PlayerSocketEmitter } from '../emitters/player.emitter'

export const playerListeners = (socket: Socket) => {
  socket.on('player:get', (guildId: string) => {
    PlayerSocketEmitter.emitPlayer(guildId)
  })

  socket.on('player:pause', (guildId: string) => {
    const dispatcher = discordClient.subscription.get(guildId)

    if (!dispatcher) {
      return
    }

    dispatcher.pause()
    PlayerSocketEmitter.emitPlayerisPlaying(guildId)
  })

  socket.on('player:position', (guildId: string, position: number) => {
    const dispatcher = discordClient.subscription.get(guildId)

    if (!dispatcher) {
      return
    }

    dispatcher.seek(position)
  })

  socket.on('player:resume', (guildId: string) => {
    const dispatcher = discordClient.subscription.get(guildId)

    if (!dispatcher) {
      return
    }

    dispatcher.unpause()
    PlayerSocketEmitter.emitPlayerisPlaying(guildId)
  })

  socket.on('player:skip', (guildId: string) => {
    const dispatcher = discordClient.subscription.get(guildId)

    if (!dispatcher) {
      return
    }

    dispatcher.skip()
  })
}
