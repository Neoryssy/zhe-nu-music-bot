import { Socket } from 'socket.io'
import discordClient from '../../../bot/discordClient'
import { Guild, VoiceChannel, TextBasedChannel } from 'discord.js'
import { VoiceStateSocketEmitter } from '../emitters/voiceState.emitter'

export const voiceStateListeners = (socket: Socket) => {
  socket.on('voiceState:get', (guildId: string) => {
    VoiceStateSocketEmitter.emitVoiceState(guildId)
  })

  socket.on('voiceState:joinChannel', ({ channelId, guildId }) => {
    const channel = discordClient.channels.cache.get(
      channelId
    ) as TextBasedChannel
    const guild = discordClient.guilds.cache.get(guildId) as Guild
    const voiceChannel = discordClient.channels.cache.get(
      channelId
    ) as VoiceChannel
    const dispatcher = discordClient.subscription.get(guildId)

    if (!dispatcher) {
      discordClient.subscription.create(guild, voiceChannel)
    } else {
      dispatcher.join(voiceChannel)
    }
  })

  socket.on('voiceState:leaveChannel', async (guildId) => {
    const dispatcher = discordClient.subscription.get(guildId)

    if (!dispatcher) {
      return
    }

    await dispatcher.destroy()

    VoiceStateSocketEmitter.emitVoiceState(guildId)
  })
}
