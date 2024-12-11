import path from 'path'
import { ILoggerConfig } from './BotConfig'

export default class Logger {
  private _enabled: boolean
  private _logger

  /** Initialize the logger with the given configuration.
   * @constructor
   */
  constructor(config: ILoggerConfig) {
    this._logger = require('log4js')
    this._enabled = config.enabled

    const fileConfig = {
      type: 'file',
      filename: path.join(__dirname, '..', '..', 'logs', 'discord-bot.log'),
      maxLogSize: config.maxLogSize,
      backups: config.backups,
      compress: true,
      encoding: 'utf8',
      flags: 'a+',
    }

    this._logger.configure({
      appenders: {
        'file-error': {
          ...fileConfig,
          // layout: {
          //   type: 'pattern',
          //   pattern: '[%r] %p --- %m',
          // },
        },
        'file-info': {
          ...fileConfig,
          // layout: {
          //   type: 'pattern',
          //   pattern: '[%r] %p --- %m',
          // },
        },
        'file-warn': {
          ...fileConfig,
          // layout: {
          //   type: 'pattern',
          //   pattern: '[%r] %p --- %m',
          // },
        },
        'stdout-error': {
          type: 'stderr',
          // layout: {
          //   type: 'pattern',
          //   pattern: '[%r] %p --- %m',
          // },
        },
        'stdout-info': {
          type: 'stdout',
          // layout: {
          //   type: 'pattern',
          //   pattern: '[%r] %p --- %m',
          // },
        },
        'stdout-trace': {
          type: 'stdout',
          // layout: {
          //   type: 'pattern',
          //   pattern: '[%r] %p --- %m',
          // },
        },
        'stdout-warn': {
          type: 'stdout',
          // layout: {
          //   type: 'pattern',
          //   pattern: '[%r] %p --- %m',
          // },
        },
      },
      categories: {
        default: {
          appenders: ['stdout-trace'],
          level: 'trace',
        },
        error: {
          appenders: ['file-error', 'stdout-error'],
          enableCallStack: true,
          level: 'error',
        },
        info: {
          appenders: ['file-info', 'stdout-info'],
          level: 'info',
        },
        trace: {
          appenders: ['stdout-trace'],
          level: 'trace',
        },
        warn: {
          appenders: ['file-warn', 'stdout-warn'],
          level: 'warn',
        },
      },
    })
  }

  /** Writes [ERROR] text to stdout and log file. */
  error(error: Error | string | unknown) {
    if (!this._enabled) return
    const logger = this._logger.getLogger('error')
    logger.error(error)
  }

  /** Writes [INFO] text to stdout and log file. */
  info(text: string) {
    if (!this._enabled) return
    const logger = this._logger.getLogger('info')
    logger.info(text)
  }

  /** Writes [TRACE] text to stdout. */
  trace(text: string) {
    if (!this._enabled) return
    const logger = this._logger.getLogger('trace')
    logger.trace(text)
  }

  /** Writes [WARN] text to stdout and log file. */
  warn(text: string) {
    if (!this._enabled) return
    const logger = this._logger.getLogger('warn')
    logger.warn(text)
  }
}
