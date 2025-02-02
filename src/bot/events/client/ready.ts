import { Events } from 'discord.js';
import DiscordMusicBot from '@/lib/DiscordMusicBot';
import CEvent from '@/lib/CEvent';
import SlashCommandsManager from '@/lib/SlashCommandsManager';

module.exports = new CEvent({
  name: Events.ClientReady,
  once: true,
  executor: async (client: DiscordMusicBot) => {
    const guilds = await client.guilds.fetch();

    try {
      guilds.forEach(async (oAuth2Guild) => {
        const guild = await oAuth2Guild.fetch();
        await new SlashCommandsManager(client).updateGuildSlashCommands(guild);
      });
    } catch (error) {
      client.log.error(error);
    }

    client.log.info(`Bot successfully logged in as ${client.user?.tag}!`);
  },
});
