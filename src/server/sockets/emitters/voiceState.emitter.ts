import { VoiceState } from 'discord.js'
import { serverIO } from '../../server'
import discordClient from '../../../bot/discordClient'

export class VoiceStateSocketEmitter {
  public static emitVoiceState = async (
    guildId: string,
    voiceState?: VoiceState
  ) => {
    if (voiceState) {
      serverIO.emit(`voiceState:${guildId}`, voiceState)
      return
    }

    const guild = discordClient.guilds.cache.get(guildId)

    if (!guild) {
      serverIO.emit(`voiceState:${guildId}`, null)
      return
    }

    const clientGuildMember = guild.members.me!
    voiceState = clientGuildMember.voice
    const voiceStateJSON = voiceState.toJSON() as object

    const data = {
      ...voiceStateJSON,
      channel: voiceState.channel,
    }

    serverIO.emit(`voiceState:${guildId}`, data)
  }
}
