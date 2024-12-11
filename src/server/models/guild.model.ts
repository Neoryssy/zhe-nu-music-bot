import { Schema, model } from 'mongoose'

interface IGuild {
  guildId: string
  musicChannelId: string
}

const guildSchema = new Schema<IGuild>({
  guildId: String,
  musicChannelId: String,
})

export const GuildModel = model<IGuild>('Guild', guildSchema)
