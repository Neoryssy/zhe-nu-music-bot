import fs from 'node:fs'
import path from 'node:path'
import {
  ApplicationCommandData,
  ApplicationCommandDataResolvable,
  Collection,
  Guild,
} from 'discord.js'
import DiscordMusicBot from './DiscordMusicBot'
import { Command } from './Command'

export default class SlashCommandsManager {
  private _client: DiscordMusicBot
  private _commands: Collection<string, ApplicationCommandData>

  constructor(client: DiscordMusicBot) {
    this._client = client
    this._commands = new Collection()

    const ext = client.config.dev ? '.ts' : '.js'
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
        if (command.slashCommand.enabled) {
          const data: ApplicationCommandData = {
            name: command.name,
            description: command.description,
            options: command.slashCommand.options,
          }
          this._commands.set(command.name, data)
        }
      }
    }
  }

  /**
   * Sets all found slash commands to guild, the maximum number of commands per day is 200. Use in extreme cases.
   * @param guild
   * @returns true if commands were setted.
   */
  public async setGuildSlashCommands(guild: Guild): Promise<boolean> {
    const cmds: ApplicationCommandDataResolvable[] = []
    this._commands.forEach((command) => {
      cmds.push(command)
    })

    try {
      await guild.commands.set(cmds)
      return true
    } catch (error) {
      this._client.log.error('Unable to register slash commands')
      this._client.log.error(error)
      return false
    }
  }

  /**
   * Update all found slash commands to guild, create new if command not exists.
   * @param guild
   * @returns true if commands were updated.
   */
  public async updateGuildSlashCommands(guild: Guild): Promise<boolean> {
    try {
      const guildCommands = await guild.commands.fetch()

      this._commands.forEach(async (command) => {
        const guildCommand = guildCommands.get(command.name)

        if (!guildCommand) await guild.commands.create(command)
        else await guild.commands.edit(guildCommand, command)
      })

      guildCommands.forEach((command) => {
        if (!this._commands.has(command.name)) guild.commands.delete(command)
      })

      return true
    } catch (error) {
      this._client.log.error('Unable to update slash commands')
      this._client.log.error(error)
      return false
    }
  }
}
