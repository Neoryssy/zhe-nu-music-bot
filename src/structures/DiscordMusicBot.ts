import fs from 'fs'
import path from 'path'
import { Client, ClientOptions, Collection } from 'discord.js'
import { Command } from './Command'
import BotConfig from './BotConfig'
import Logger from './Logger'
import { Connectors, Shoukaku } from 'shoukaku'
import assignManagerEvents from '../bot/events/manager/manager'
import СEvent from './CEvent'
import Subscription from './Subscription'

export default class DiscordMusicBot extends Client {
  private _commands: Collection<string, Command>
  private _config: BotConfig
  private _log: Logger
  private _manager?: Shoukaku
  private _subscription: Subscription

  constructor(options: ClientOptions) {
    super(options)

    this._commands = new Collection()
    this._config = new BotConfig(this)
    this._log = new Logger(this._config.logger)
    this._subscription = new Subscription(this)

    this.loadCommands()
    this.loadEvents()
  }

  get commands() {
    return this._commands
  }
  get config() {
    return this._config
  }
  get log() {
    return this._log
  }
  get manager(): Shoukaku | undefined {
    return this._manager
  }
  get subscription() {
    return this._subscription
  }

  async build() {
    this._log.info('Building bot...')

    const Nodes = [this._config.lavalink.node]
    const options = this._config.lavalink.options

    this._log.info('Initialize manager...')
    this._manager = new Shoukaku(new Connectors.DiscordJS(this), Nodes, options)
    await assignManagerEvents(this)
    this._log.info('Manager initialized!')

    this._log.info('Logining bot by token...')
    await this.login(this.config.token)
    this._log.info('Logged bot by token!')

    this._log.info('Successfully built bot!')
  }

  loadEvents() {
    this._log.info('Loading events...')

    const ext = this._config.dev ? '.ts' : '.js'
    const eventsPath = path.join(__dirname, '..', 'bot', 'events', 'client')
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(ext)) as string[]

    for (const file of eventFiles) {
      const filesPath = path.join(eventsPath, file)
      const event = require(filesPath) as СEvent

      if (event.once) {
        // @ts-ignore
        this.once(event.name, (...args) => event.execute(this, ...args))
      } else {
        // @ts-ignore
        this.on(event.name, (...args) => event.execute(this, ...args))
      }
      this._log.info(`Loaded event "${event.name}"`)
    }

    this._log.info('Events loaded!')
  }

  loadCommands() {
    try {
      this._log.info('Loading commands...')

      const ext = this._config.dev ? '.ts' : '.js'
      const foldersPath = path.join(__dirname, '..', 'bot', 'commands')
      const commandFolders = fs.readdirSync(foldersPath) as string[]

      for (const folder of commandFolders) {
        const commandPath = path.join(foldersPath, folder)
        const commandFiles = fs
          .readdirSync(commandPath)
          .filter((file) => file.endsWith(ext)) as string[]

        for (const file of commandFiles) {
          const filePath = path.join(commandPath, file)
          const command = require(filePath) as Command
          this._commands.set(command.name, command)
          this._log.info(`Loaded command "${command.name}"`)
        }
      }

      this._log.info(`Loaded ${this._commands.size} commands`)
    } catch (error) {
      this._log.error('Unable to load commands')
      this._log.error(error)
      process.exit(1)
    }
  }
}
