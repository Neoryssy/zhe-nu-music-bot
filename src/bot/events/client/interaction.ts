import { BaseInteraction, Events, Interaction } from 'discord.js'
import DiscordMusicBot from '../../../structures/DiscordMusicBot'
import CEvent from '../../../structures/CEvent'
import Context from '../../../structures/Context'

module.exports = new CEvent({
  name: Events.InteractionCreate,
  async executor(client: DiscordMusicBot, interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command || !command.slashCommand) {
      client.log.warn(
        `No slash command matching "${interaction.commandName}" was found.`
      )
      return
    }

    const ctx = new Context(client, interaction, [...interaction.options.data])

    try {
      await command.execute(client, ctx, ctx.args)
    } catch (error) {
      if (interaction.replied || interaction.deferred) {
        client.log.warn('Interaction has been replied or deferred.')
        await interaction.followUp({
          content: 'Произошла ошибка при выполнении команды!',
          ephemeral: true,
        })
      } else {
        client.log.warn('Interaction has been cancelled.')
        await interaction.reply({
          content: 'Произошла ошибка при выполнении команды!',
          ephemeral: true,
        })
      }
    }
  },
})
