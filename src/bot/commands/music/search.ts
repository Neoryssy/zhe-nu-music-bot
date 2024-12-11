import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ComponentType,
  InteractionResponse,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js'
import { Command } from '../../../structures/Command'
import { LoadType } from 'shoukaku'

module.exports = new Command({
  name: 'search',
  description: 'Search music',
  slashCommand: {
    enabled: true,
    options: [
      {
        name: 'query',
        description: 'Search query',
        required: true,
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
  executor: async (client, ctx, args) => {
    try {
      let msg: InteractionResponse
      const query = args.join(' ')
      const res = await client.subscription.search(query)
      const row = new ActionRowBuilder()
      const select = new StringSelectMenuBuilder()

      if (!res) {
        ctx.sendMessage({
          content: 'Произошла ошибка во время поиска',
        })
      }

      switch (res?.loadType) {
        case LoadType.ERROR: {
          ctx.sendMessage({
            content: 'Произошла ошибка во время поиска',
          })
          return
        }
        case LoadType.EMPTY: {
          ctx.sendMessage({
            content: 'Ничего не найдено',
          })
          return
        }
        // case LoadType.TRACK:
        case LoadType.SEARCH: {
          const tracks = res.data.slice(0, 10)
          select
            .setCustomId('select-track')
            .setPlaceholder('Выберите трек')
            .addOptions(
              tracks.map((track, idx) => {
                const data = new StringSelectMenuOptionBuilder({
                  label: track.info.title,
                  value: idx.toString(),
                })
                return data
              })
            )
          row.addComponents(select)
          msg = await ctx.sendMessage({
            content: 'Выберите трек',
            components: [row],
          })
          break
        }
        default:
          return
      }

      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        max: 1,
        time: 60000,
      })

      collector.on('collect', async (i) => {
        const selection = Number(i.values[0])
        await ctx.editMessage(
          `${i.user} выбрал трек ${res.data[selection].info.title}`
        )
        await i.deferUpdate()
      })
      collector.on('end', async (_, reason) => {
        select.setDisabled(true)
        switch (reason) {
          case 'time':
            await ctx.editMessage({
              content: 'Истекло время выбора',
              components: [row],
            })
            break
          case 'limit':
            await ctx.editMessage({
              components: [row],
            })
            break
        }
      })
    } catch (error) {
      client.log.error(error)
    }
  },
})
