import { GuildMember } from 'discord.js'
import { Command } from '../../../structures/Command'

module.exports = new Command({
  name: 'user',
  description: 'Get information about the user',
  slashCommand: {
    enabled: true,
  },
  executor: async (client, ctx, args) => {
    const member = ctx.member as GuildMember
    try {
      await ctx.sendMessage({
        content: `This command was run by ${ctx.author.username}, who joined on ${member?.joinedAt}.`,
      })
    } catch (error) {
      client.log.error(error)
    }
  },
})
