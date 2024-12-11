import { Guild } from 'discord.js'
import { Command } from '../../../structures/Command'
import EmbedBlueprint from '../../../structures/EmbedBlueprint'

module.exports = new Command({
  name: 'queue',
  description: 'Show the queue of tracks',
  slashCommand: {
    enabled: true,
  },
  async executor(client, ctx, args) {
    const guild = ctx.guild as Guild
    const dispatcher = client.subscription.get(guild.id)

    if (!dispatcher) {
      const embed = new EmbedBlueprint(client).emptyQueue()
      ctx.sendMessage({ embeds: [embed] })
      return
    }

    const {
      current: currentTrack,
      player: { position },
      queue,
    } = dispatcher
    const embed = new EmbedBlueprint(client).queue(
      { currentTrack, position },
      queue
    )
    ctx.sendMessage({ embeds: [embed] })
  },
})
