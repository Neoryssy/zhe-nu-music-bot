import { ChannelType, Events, Message } from 'discord.js'
import DiscordMusicBot from '../../../structures/DiscordMusicBot'
import CEvent from '../../../structures/CEvent'
import Context from '../../../structures/Context'

module.exports = new CEvent({
  name: Events.MessageCreate,
  executor: async (client: DiscordMusicBot, message: Message) => {
    try {
      if (message.author.bot) return
      if (message.channel.type === ChannelType.DM) return

      const prefix = client.config.defaultPrefix

      if (!message.content.startsWith(prefix)) return

      const args = message.content.slice(prefix.length).trim().split(/ +/)
      const commandName = args.shift()!.toLowerCase()

      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        )

      if (!command) return

      const ctx = new Context(client, message, args)

      try {
        client.log.info(`Executing command "${command.name}"`)
        await command.execute(client, ctx, ctx.args)
        client.log.info(`Executed command "${command.name}"`)
      } catch (error) {
        client.log.error(
          `There was an error while executing command "${command.name}"!`
        )
        client.log.error(error)

        message.reply({
          content: 'Произошла ошибка при выполнении команды!',
        })
      }
    } catch (error) {
      client.log.error(error)
    }
  },
})
