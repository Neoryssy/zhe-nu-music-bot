import { Events } from "discord.js"
import DiscordMusicBot from "./DiscordMusicBot"

export interface IСEventOptions {
  name: Events
  once?: boolean
  executor: (client: DiscordMusicBot, ...args: any[]) => Promise<any>
}

export default class СEvent {
  private _name: Events
  private _once: boolean
  private _executor: (client: DiscordMusicBot, ...args: any[]) => any

  constructor({ name, once, executor }: IСEventOptions) {
    this._name = name
    this._once = once || false
    this._executor = executor
  }

  get name() {
    return this._name
  }

  get once() {
    return this._once
  }

  async execute(client: DiscordMusicBot, ...args: any[]) {
    await this._executor(client, ...args)
  }
}
