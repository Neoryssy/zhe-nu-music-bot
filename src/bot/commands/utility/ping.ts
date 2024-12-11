import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../../structures/Command'

module.exports = new Command({
  name: 'ping',
  description: "Check the bot's ping",
  slashCommand: {
    enabled: true,
  },
  executor: async (client, ctx, args) => {
    try {
      const sent = await ctx.sendMessage({
        content: 'Pinging...',
      })
      await ctx.editMessage({
        content: `Roundtrip latency: ${
          sent.createdTimestamp - ctx.createdTimestamp
        }ms`,
      })
    } catch (error) {
      client.log.error(error)
    }
  },
})
