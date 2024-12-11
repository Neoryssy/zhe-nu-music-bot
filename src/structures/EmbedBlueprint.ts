import { EmbedBuilder } from 'discord.js'
import DiscordMusicBot from './DiscordMusicBot'
import { DiscordTrack } from './Dispatcher'
import { msToISOString } from '../utils/ISO'

export default class EmbedBlueprint {
  private _client: DiscordMusicBot

  constructor(client: DiscordMusicBot) {
    this._client = client
  }

  emptyQueue() {
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Очередь пуста')
      .setDescription(
        'Чтобы добавить треки в очередь, воспользуйтесь командой `/play`'
      )

    return embed
  }

  enqueuePlaylist(playlistInfo: {
    title: string
    thumbnailURL: string
    url: string
  }) {
    const value = `[${playlistInfo.title}](${playlistInfo.url})`
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setThumbnail(playlistInfo.thumbnailURL)
      .addFields([{ name: 'Плейлист добавлен в очередь', value }])

    return embed
  }

  enqueueTrack(track: DiscordTrack) {
    const value = `[${track.info.title}](${track.info.uri})`
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setThumbnail(track.info.thumbnailURL)
      .addFields([{ name: 'Трек добавлен в очередь', value }])

    return embed
  }

  error(message: string) {
    const embed = new EmbedBuilder().setColor('Red').setDescription(message)
    return embed
  }

  message(message: string) {
    const embed = new EmbedBuilder().setColor('Blue').setDescription(message)
    return embed
  }

  nowPlaying(track: DiscordTrack) {
    const value = `[${track.info.title}](${track.info.uri})`
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setThumbnail(track.info.thumbnailURL)
      .addFields([{ name: 'Сейчас играет', value }])

    return embed
  }

  queue(
    {
      currentTrack,
      position,
    }: { currentTrack: DiscordTrack | null; position: number },
    queue: DiscordTrack[]
  ) {
    const descriptionParts: string[] = []
    const embed = new EmbedBuilder().setColor('Blue')
    const title =
      queue.length === 0 ? 'Очередь пуста' : `Треков в очереди: ${queue.length}`

    if (currentTrack) {
      const durationLeft = currentTrack.info.length - position
      descriptionParts.push('**Сейчас играет**')
      descriptionParts.push(
        `[${currentTrack.info.title}](${
          currentTrack.info.uri
        }) \`${msToISOString(durationLeft)}\``
      )
    }

    if (queue.length > 0) {
      descriptionParts.push('', '**В очереди**')
      queue.slice(0, 10).forEach((track, index) => {
        const trackIndex = index + 1
        descriptionParts.push(
          `\`${trackIndex}\` [${track.info.title}](${
            track.info.uri
          }) \`${msToISOString(track.info.length)}\``
        )
      })
    } else {
      descriptionParts.push(
        '',
        `Чтобы добавить треки в очередь, воспользуйтесь командой \`/play\``
      )
    }

    embed.setTitle(title).setDescription(descriptionParts.join('\n'))

    return embed
  }

  warn(message: string) {
    const embed = new EmbedBuilder().setColor('Yellow').setDescription(message)
    return embed
  }
}
