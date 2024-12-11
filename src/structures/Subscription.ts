import { Guild, TextBasedChannel, VoiceBasedChannel } from 'discord.js'
import DiscordMusicBot from './DiscordMusicBot'
import Dispatcher from './Dispatcher'
import { isValidURL } from '../utils/URL'
import { GuildModel } from '../server/models/guild.model'

export default class Subscription extends Map<string, Dispatcher> {
  private _client: DiscordMusicBot

  constructor(client: DiscordMusicBot) {
    super()
    this._client = client
  }

  async create(
    guild: Guild,
    voice: VoiceBasedChannel,
    channel?: TextBasedChannel
  ) {
    try {
      if (!channel) {
        const guildDocument = await GuildModel.findOne({ guildId: guild.id })
        const channelId = guildDocument?.musicChannelId as string
        
        channel = guild.channels.cache.get(channelId) as TextBasedChannel
      }

      let dispatcher = this.get(guild.id)
      if (!dispatcher) {
        const node = this._client.manager?.getNode()
        const player = await node!.joinChannel({
          channelId: voice.id,
          guildId: guild.id,
          shardId: 0,
        })

        dispatcher = new Dispatcher({
          client: this._client,
          guildId: guild.id,
          channelId: channel.id,
          voiceId: voice.id,
          player,
        })
        this.set(guild.id, dispatcher)
      }
      return dispatcher
    } catch (error) {
      this._client.log.error(error)
    }
  }

  async search(query: string) {
    const node = this._client.manager?.getNode()
    let response = null
    try {
      response = await node!.rest.resolve(
        isValidURL(query) ? query : `ytsearch:${query}`
      )
    } catch (e) {
      this._client.log.error(e)
    }
    return response
  }
}
