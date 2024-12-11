import { Events } from 'discord.js'
import DiscordMusicBot from '../../../structures/DiscordMusicBot'
import CEvent from '../../../structures/CEvent'
import SlashCommandsManager from '../../../structures/SlashCommandsManager'

module.exports = new CEvent({
  name: Events.ClientReady,
  once: true,
  executor: async (client: DiscordMusicBot) => {
    const guilds = await client.guilds.fetch()

    try {
      guilds.forEach(async (oAuth2Guild) => {
        const guild = await oAuth2Guild.fetch()
        await new SlashCommandsManager(client).updateGuildSlashCommands(guild)
      })
    } catch (error) {
      client.log.error(error)
    }

    client.log.info(`Bot successfully logged in as ${client.user?.tag}!`)
  },
})
