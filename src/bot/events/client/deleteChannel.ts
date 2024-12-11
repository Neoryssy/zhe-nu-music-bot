import { ChannelType, Events, GuildChannel, TextChannel } from 'discord.js'
import CEvent from '../../../structures/CEvent'
import { GuildModel } from '../../../server/models/guild.model'

module.exports = new CEvent({
  name: Events.ChannelDelete,
  executor: async (client, channel: GuildChannel) => {
    const guild = channel.guild
    const guildDocument = await GuildModel.findOne({
      guildId: guild.id,
    })

    if (!guildDocument) return

    const { musicChannelId } = guildDocument
    if ((channel.id = musicChannelId)) {
      const channels = guild.channels
      const newMusicChannel = channels.cache.find(
        (channel) => channel.type == ChannelType.GuildText
      ) as TextChannel | undefined

      if (newMusicChannel) {
        guildDocument.musicChannelId = newMusicChannel.id
        await guildDocument.save()
        newMusicChannel.send('Текущий канал установлен для управления воспроизведением')
      }
    }
  },
})
