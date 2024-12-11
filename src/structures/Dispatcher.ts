import { Player, Shoukaku, Track } from 'shoukaku'
import DiscordMusicBot from './DiscordMusicBot'
import { GuildMember, TextBasedChannel, TextChannel, VoiceBasedChannel } from 'discord.js'
import EmbedBlueprint from './EmbedBlueprint'
import Timer from '../utils/Timer'
import { QueueSocketEmitter } from '../server/sockets/emitters/queue.emitter'
import { PlayerSocketEmitter } from '../server/sockets/emitters/player.emitter'

export interface IDiscordTrack extends Track {
  requester: GuildMember
}

export class DiscordTrack implements IDiscordTrack {
  encoded: string
  info: {
    identifier: string
    isSeekable: boolean
    author: string
    length: number
    isStream: boolean
    position: number
    thumbnailURL: string
    title: string
    uri?: string
    sourceName: string
  }
  pluginInfo: unknown
  requester: GuildMember

  constructor(options: IDiscordTrack) {
    const thumbnailURL = `https://img.youtube.com/vi/${options.info.identifier}/0.jpg`
    this.info = { ...options.info, thumbnailURL }
    this.requester = options.requester
    this.encoded = options.encoded
  }
}

export interface IDispatcherOptions {
  client: DiscordMusicBot
  guildId: string
  voiceId: string
  channelId: string
  manager: Shoukaku
  player: Player
}

export default class Dispatcher {
  private _client: DiscordMusicBot
  private _guildId: string
  private _channelId: string
  private _manager: Shoukaku
  private _player: Player
  private _queue: DiscordTrack[]
  private _current: DiscordTrack | null
  private _timer: Timer

  constructor(options: IDispatcherOptions) {
    this._client = options.client
    this._guildId = options.guildId
    this._channelId = options.channelId
    this._manager = options.manager
    this._player = options.player
    this._queue = []
    this._current = null
    this._timer = new Timer()

    this._player.on('update', ({ state }) => {
      PlayerSocketEmitter.emitPlayerPosition(this._guildId)
    })
    this._player.on('end', async (event) => {
      this._current = null
      this._player.position = 0

      if (event.reason === 'finished') {
        await this.tryPlay()
      }

      PlayerSocketEmitter.emitPlayer(this._guildId)
    })
    this._player.on('start', (_) => {
      if (!this._current) return
      const channel = this._client.channels.cache.get(
        this._channelId
      ) as TextChannel
      const embed = new EmbedBlueprint(this._client).nowPlaying(this._current)
      channel.send({ embeds: [embed] })

      PlayerSocketEmitter.emitPlayer(this._guildId)
    })
  }

  get channelId() {
    return this._channelId
  }
  get client() {
    return this._client
  }
  get current() {
    return this._current
  }
  get duration() {
    if (!this._current) return 0
    return this._current.info.length
  }
  get guildId() {
    return this._guildId
  }
  get isPlaying() {
    return !this._player.paused
  }
  get paused() {
    return this._player.paused
  }
  get player() {
    return this._player
  }
  get position() {
    return this._player.position
  }
  get queue() {
    return this._queue
  }
  get timer() {
    return this._timer
  }
  get voiceId() {
    return this._manager.connections.get(this._guildId)?.channelId
  }

  clear() {
    this.setQueue([])
  }

  destroy() {
    this._manager.leaveVoiceChannel(this._guildId)
    this.setQueue([])
    this._client.subscription.delete(this._guildId)

    PlayerSocketEmitter.emitPlayer(this._guildId)
  }

  enqueue(track: DiscordTrack) {
    this.setQueue([...this._queue, track])
  }

  async join(voice: VoiceBasedChannel) {
    try {
      await this._manager.joinVoiceChannel({
        channelId: voice.id,
        guildId: this._guildId,
        shardId: 0,
      })
    } catch (error) {
      this._client.log.error(error)
    }
  }

  moveTrack(from: number, to: number) {
    if (!this._current) return

    const queue = [...this._queue]
    const track = queue.splice(from, 1)[0]

    queue.splice(to, 0, track)

    this.setQueue(queue)
  }

  pause() {
    if (!this._current) return
    if (this.paused) return

    return this._player.setPaused(true)
  }

  removeTrack(index: number) {
    if (!this._current) return
    const queue = [...this._queue]
    queue.splice(index, 1)

    this.setQueue(queue)
  }

  seek(position: number) {
    if (!this._current) return
    this._player.seekTo(position)
  }

  private setQueue(queue: DiscordTrack[]) {
    this._queue = queue
    QueueSocketEmitter.emitQueue(this._guildId)
  }

  skip() {
    if (!this._current) return
    const position = this._current.info.length

    this._player.setPaused(false)
    this._player.seekTo(position)
  }

  stop() {
    this._player.stopTrack()
    this.setQueue([])
  }

  async tryPlay() {
    if (!this.voiceId) return
    if (!this._queue.length) {
      this._current = null
      return
    }
    if (this._current) return

    const queue = [...this._queue]
    const track = queue.shift() as DiscordTrack
    await this._player.playTrack({ track })
    this._current = track

    this.setQueue(queue)
  }

  unpause() {
    if (!this._current) return
    if (!this.paused) return

    return this._player.setPaused(false)
  }
}
