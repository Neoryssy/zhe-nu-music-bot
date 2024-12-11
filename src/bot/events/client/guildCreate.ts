import { ChannelType, Events, Guild, TextChannel } from 'discord.js'
import CEvent from '../../../structures/CEvent'
import SlashCommandsManager from '../../../structures/SlashCommandsManager'
import { GuildModel } from '../../../server/models/guild.model'

module.exports = new CEvent({
  name: Events.GuildCreate,
  executor: async (client, guild: Guild) => {
    client.log.info(`New guild joined: ${guild.name} (${guild.id})`)
    try {
      await new SlashCommandsManager(client).setGuildSlashCommands(guild)
      client.log.info(
        `Slash commands for guild ${guild.name} (${guild.id}) registered`
      )

      const channels = guild.channels
      let musicChannel = channels.cache.find((channel) =>
        channel.type === ChannelType.GuildText && channel.name.includes('music')
      ) as TextChannel | undefined

      if (!musicChannel) {
        musicChannel = await channels.create({
          name: 'music',
          type: ChannelType.GuildText,
        })
      }

      let guildDocument = await GuildModel.findOne({ guildId: guild.id })

      if (guildDocument) {
        guildDocument.musicChannelId = musicChannel.id
      } else {
        guildDocument = new GuildModel({
          guildId: guild.id,
          musicChannelId: musicChannel.id,
        })
      }

      await guildDocument.save()

      musicChannel.send(`Текущий канал установлен для управления воспроизведением`)
    } catch (error) {
      client.log.error(error)
    }
  },
})
