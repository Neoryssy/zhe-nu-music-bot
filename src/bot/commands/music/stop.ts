import { Guild } from 'discord.js'
import { Command } from '../../../structures/Command'

module.exports = new Command({
  name: 'stop',
  description: 'Stop playing music',
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

    dispatcher.stop()
    ctx.sendMessage({
      content: 'Я остановил воспроизведение музыки',
    })
  },
})
