import { Guild, GuildMember, TextBasedChannel } from 'discord.js'
import { Command } from '../../../structures/Command'

module.exports = new Command({
  name: 'leave',
  description: 'Leave the voice channel',
  slashCommand: {
    enabled: true,
  },
  async executor(client, ctx, args) {
    const guild = ctx.guild as Guild
    const dispather = client.subscription.get(guild.id)
    const voiceId = dispather?.voiceId

    try {
      if (!voiceId) {
        await ctx.sendMessage({
          content: 'Я не нахожусь в голосовом канале',
        })
        return
      }
      await dispather.destroy()
      await ctx.sendMessage({
        content: `Я покинул голосовой канал <#${voiceId}>`,
      })
    } catch (error) {
      client.log.error(error)
    }
  },
})
