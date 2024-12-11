import {
  ApplicationCommandOptionType,
  ChannelType,
  Guild,
  GuildMember,
  TextBasedChannel,
  TextChannel,
  VoiceBasedChannel,
} from 'discord.js'
import { Command } from '../../../structures/Command'
import Context from '../../../structures/Context'
import DiscordMusicBot from '../../../structures/DiscordMusicBot'

module.exports = new Command({
  name: 'join',
  description: 'Join a voice channel',
  slashCommand: {
    enabled: true,
    options: [
      {
        name: 'channel',
        description: 'The voice channel to join',
        type: ApplicationCommandOptionType.Channel,
        channel_types: [ChannelType.GuildVoice],
      },
    ],
  },
  async executor(client, ctx, args) {
    const channel = ctx.channel as TextBasedChannel
    const guild = ctx.guild as Guild
    const member = ctx.member as GuildMember
    const voice: VoiceBasedChannel | null =
      ctx.interaction?.options.getChannel('channel') || member.voice.channel

    try {
      if (!voice) {
        await ctx.sendMessage({
          content: 'Вы должны быть в голосовом канале!',
        })
        return
      }

      let dispatcher = client.subscription.get(guild.id)
      if (dispatcher) {
        await ctx.sendMessage({
          content: 'Я уже нахожусь в голосовом канале!',
        })
        return
      } else {
        await ctx.sendMessage({
          content: 'Присоединяюсь к голосовому каналу...',
        })
        dispatcher = await client.subscription.create(guild, voice)
        await ctx.editMessage({
          content: `Я присоединился к голосовому каналу ${voice}!`,
        })
      }
    } catch (error) {
      client.log.error(error)
      await ctx.sendMessage({
        content: 'Произошла ошибка при присоединении к голосовому каналу',
      })
    }
  },
})
