import { GatewayIntentBits } from 'discord.js'
import DiscordMusicBot from '../structures/DiscordMusicBot'

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates,
]
export default new DiscordMusicBot({ intents })
