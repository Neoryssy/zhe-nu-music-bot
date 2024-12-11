import fs from 'fs'
import path from 'path'
import DiscordMusicBot from './DiscordMusicBot'

export interface ILoggerConfig {
  enabled: boolean
  logPath: string
  maxLogSize: number
  backups: number
}

export default class BotConfig {
  dev: boolean
  lavalink: {
    node: {
      name: string
      url: string
      auth: string
      secure?: boolean
    }
    options: {
      reconnectInterval?: number
      reconnectTries?: number
    }
  }
  logger: ILoggerConfig
  defaultPrefix: string
  defaultVolume: number
  leaveDelay: number
  '24/7': boolean
  token: string
  website: string

  /**
   * Creates a configuration object based on .env and config.json.
   */
  constructor(client: DiscordMusicBot) {
    try {
      const fPath = path.join(__dirname, '..', '..', 'config.json')
      const config = JSON.parse(fs.readFileSync(fPath).toString())

      this.validateConfig(config)
      this.dev = !!config.dev

      this.lavalink = {
        node: {
          name: config.lavalink.node.name,
          url: config.lavalink.node.url,
          auth: config.lavalink.node.auth,
          secure: config.lavalink.node.secure,
        },
        options: {
          reconnectInterval: config.lavalink.options.reconnectInterval,
          reconnectTries: config.lavalink.options.reconnectTries,
        },
      }
      this.logger = {
        backups: config.logger.backups || 3,
        enabled: config.logger.enabled || false,
        logPath: config.logger.logPath || './logs',
        maxLogSize: config.logger.maxLogSize || 10 * 1024 * 1024, // 10 MB
      }

      this.token = process.env.DISCORD_TOKEN!
      this.defaultPrefix = config.defaultPrefix
      this.defaultVolume = config.defaultVolume || 100
      this.leaveDelay = config.leaveDelay || 600000
      this['24/7'] = config['24/7'] || false
      this.website = config.website || 'https://example.com'
    } catch (error) {
      console.log('Unable to load config')
      console.log(error)
      process.exit(1)
    }
  }

  validateConfig(config: any) {
    try {
      if (!config.defaultPrefix)
        throw new Error('Missing defaultPrefix in config.json')
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }
}
