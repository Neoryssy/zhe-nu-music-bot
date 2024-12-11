import { Guild } from 'discord.js'
import { Command } from '../../../structures/Command'

module.exports = new Command({
  name: 'unpause',
  description: 'Unpauses the music',
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
    if (!dispatcher.paused) {
      ctx.sendMessage({
        content: 'Я уже проигрываю музыку',
      })
      return
    }

    dispatcher.unpause()
    ctx.sendMessage({
      content: 'Я возобновил воспроизведение музыки',
    })
  },
})
