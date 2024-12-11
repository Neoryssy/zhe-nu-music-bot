import {
  APIInteractionGuildMember,
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  Message,
  TextBasedChannel,
  User,
} from 'discord.js'
import DiscordMusicBot from './DiscordMusicBot'

export default class Context {
  client: DiscordMusicBot
  ctx: ChatInputCommandInteraction | Message
  isInteraction: boolean
  interaction: ChatInputCommandInteraction | null
  message: Message | null
  id: string
  channelId: string
  author: User
  channel: TextBasedChannel | null
  guild: Guild | null
  createdAt: Date
  createdTimestamp: number
  member: GuildMember | APIInteractionGuildMember | null
  args!: any[]
  msg: any

  constructor(
    client: DiscordMusicBot,
    ctx: ChatInputCommandInteraction | Message,
    args: any[]
  ) {
    this.client = client
    this.ctx = ctx
    this.isInteraction = ctx instanceof ChatInputCommandInteraction
    this.interaction = ctx instanceof ChatInputCommandInteraction ? ctx : null
    this.message = ctx instanceof Message ? ctx : null
    this.id = ctx.id
    this.channelId = ctx.channelId
    this.author = ctx instanceof Message ? ctx.author : ctx.user
    this.channel = ctx.channel
    this.guild = ctx.guild
    this.createdAt = ctx.createdAt
    this.createdTimestamp = ctx.createdTimestamp
    this.member = ctx.member
    this.setArgs(args)
  }

  async editMessage(content: any) {
    try {
      if (this.msg)
        if (this.isInteraction)
          this.msg = await this.interaction?.editReply(content)
        else this.msg = await this.message?.edit(content)
    } catch (e) {
      this.client.log.error(e)
    }
    return this.msg
  }

  setArgs(args: any[]) {
    if (this.isInteraction) this.args = args.map((arg) => arg.value)
    else this.args = args
  }

  async sendMessage(content: any): Promise<any> {
    try {
      if (this.isInteraction) this.msg = await this.interaction?.reply(content)
      else this.msg = await this.message?.reply(content)
    } catch (e) {
      console.log(e)
    }
    return this.msg
  }
}
