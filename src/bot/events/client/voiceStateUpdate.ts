import { Events, VoiceBasedChannel, VoiceState } from 'discord.js'
import CEvent from '../../../structures/CEvent'
import DiscordMusicBot from '../../../structures/DiscordMusicBot'
import { VoiceStateSocketEmitter } from '../../../server/sockets/emitters/voiceState.emitter'

const connectedToClientChannel = (
  client: DiscordMusicBot,
  newState: VoiceState
) => {
  const { channel } = newState
  const clientId = client.user?.id
  if (!channel) return false

  return channel?.members.some(({ user }) => user.id === clientId)
}

const hasPeopleInChannel = (channel: VoiceBasedChannel) => {
  return channel.members.some((member) => !member.user.bot)
}

const leavedFromClientChannel = (
  client: DiscordMusicBot,
  oldState: VoiceState
) => {
  const { channel } = oldState
  const clientId = client.user?.id
  if (!channel) return false

  return channel?.members.some(({ user }) => user.id === clientId)
}

module.exports = new CEvent({
  name: Events.VoiceStateUpdate,
  executor: async (client, oldState: VoiceState, newState: VoiceState) => {
    const guildId = oldState.guild.id
    const dispatcher = client.subscription.get(guildId)
    const isClient = oldState.member?.user.id === client.user?.id
    const leaveDelay = client.config.leaveDelay

    if (isClient) {
      VoiceStateSocketEmitter.emitVoiceState(guildId)

      if (newState.channel === null) {
        dispatcher?.destroy()
      }
    } else {
      if (!dispatcher) {
        return
      }
      
      if (connectedToClientChannel(client, newState)) {
        dispatcher.timer.stop()
      }
      if (
        oldState.channel &&
        leavedFromClientChannel(client, oldState) &&
        !hasPeopleInChannel(oldState.channel)
      ) {
        dispatcher.timer.set(leaveDelay, () => {
          dispatcher.destroy()
        })
      }
    }
  },
})
