import { Guild } from 'discord.js'
import { Command } from '../../../structures/Command'

module.exports = new Command({
  name: 'skip',
  description: 'Skip track',
  slashCommand: {
    enabled: true,
  },
  async executor(client, ctx, args) {
    const guild = ctx.guild as Guild
    const dispatcher = client.subscription.get(guild.id)
    if (!dispatcher || !dispatcher.current) {
      ctx.sendMessage({
        content: 'Я сейчас не проигрываю музыку',
      })
      return
    }

    dispatcher.skip()
    ctx.sendMessage({
      content: 'Я пропустил трек',
    })
  },
})
