import { ApplicationCommandOptionData } from 'discord.js'
import DiscordMusicBot from './DiscordMusicBot'
import Context from './Context'
import CommandContext from './Context'

export interface ICommandOptions {
  name: string
  description: string
  slashCommand?: {
    enabled: boolean
    ephemeral?: boolean
    options?: ApplicationCommandOptionData[]
  }
  aliases?: string[]
  usage?: string
  cooldown?: number
  guildOnly?: boolean
  permissions?: string[]
  executor(client: DiscordMusicBot, ctx: Context, args: any[]): Promise<void>
}

export class Command {
  private _name: string
  private _description: string
  private _slashCommand: {
    enabled: boolean
    ephemeral?: boolean
    options?: ApplicationCommandOptionData[]
  }
  private _aliases: string[]
  private _usage: string
  private _cooldown: number
  private _guildOnly: boolean
  private _permissions: string[]
  private _executor: (
    client: DiscordMusicBot,
    ctx: Context,
    args: any[]
  ) => Promise<void>

  constructor(options: ICommandOptions) {
    this._name = options.name
    this._description = options.description
    this._slashCommand = options.slashCommand || { enabled: false }
    this._aliases = options.aliases || []
    this._usage = options.usage || ''
    this._cooldown = options.cooldown || 0
    this._guildOnly = options.guildOnly || false
    this._permissions = options.permissions || []
    this._executor = options.executor
  }

  get name() {
    return this._name
  }

  get description() {
    return this._description
  }

  get slashCommand() {
    return this._slashCommand
  }

  get aliases() {
    return this._aliases
  }

  get usage() {
    return this._usage
  }

  get cooldown() {
    return this._cooldown
  }

  get guildOnly() {
    return this._guildOnly
  }

  get permissions() {
    return this._permissions
  }

  async execute(client: DiscordMusicBot, ctx: Context, args: any[]) {
    try {
      await this._executor(client, ctx, args)
    } catch (error) {
      client.log.error(error)
    }
  }
}
