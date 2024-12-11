import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  Guild,
  GuildMember,
  TextBasedChannel,
} from 'discord.js'
import { Command } from '../../../structures/Command'
import { DiscordTrack } from '../../../structures/Dispatcher'
import { isValidURL } from '../../../utils/URL'
import EmbedBlueprint from '../../../structures/EmbedBlueprint'
import { LoadType } from 'shoukaku'

module.exports = new Command({
  name: 'play',
  description: 'Plays a song',
  slashCommand: {
    enabled: true,
    options: [
      {
        name: 'query',
        description: 'The song to play',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  async executor(client, ctx, args) {
    try {
      const channel = ctx.channel as TextBasedChannel
      const guild = ctx.guild as Guild
      const member = ctx.member as GuildMember
      const query = args.join(' ')
      const res = await client.subscription.search(query)
      const voice = member.voice.channel
      let dispatcher = client.subscription.get(guild.id)
      if (!dispatcher) {
        if (!voice) {
          const embed = new EmbedBlueprint(client).warn(
            'Необходимо находиться в голосовом канале'
          )
          ctx.sendMessage({ embeds: [embed] })
          return
        } else {
          dispatcher = await client.subscription.create(guild, voice)
        }
      }

      switch (res?.loadType) {
        case LoadType.ERROR: {
          const embed = new EmbedBlueprint(client).error(
            'Произошла ошибка во время поиска трека'
          )
          ctx.sendMessage({ embeds: [embed] })
          return
        }
        case LoadType.EMPTY: {
          const embed = new EmbedBlueprint(client).message('Ничего не найдено')
          ctx.sendMessage({ embeds: [embed] })
          return
        }
        case LoadType.PLAYLIST: {
          let embed: EmbedBuilder | null = null
          res.data. tracks.forEach((t, i) => {
            const track = new DiscordTrack({
              encoded: t.encoded,
              info: t.info,
              requester: ctx.member as GuildMember,
              pluginInfo: t.pluginInfo,
            })
            if (i === 0) {
              embed = new EmbedBlueprint(client).enqueuePlaylist({
                thumbnailURL: track.info.thumbnailURL,
                title: res.data.info.name,
                url: args[0],
              })
            }
            dispatcher?.enqueue(track)
          })

          ctx.sendMessage({ embeds: [embed] })
          break
        }
        //case LoadType.TRACK:
        case LoadType.SEARCH: {
          const data = res.data[0]
          const track = new DiscordTrack({
            encoded: data.encoded,
            info: data.info,
            requester: ctx.member as GuildMember,
            pluginInfo: data.pluginInfo,
          })
          dispatcher?.enqueue(track)

          const embed = new EmbedBlueprint(client).enqueueTrack(track)
          ctx.sendMessage({ embeds: [embed] })
          break
        }
      }

      await dispatcher?.tryPlay()
    } catch (error) {
      client.log.error(error)
      const embed = new EmbedBlueprint(client).error(
        'Произошла ошибка во время выполнения команды'
      )
      ctx.sendMessage({ embeds: [embed] })
    }
  },
})
