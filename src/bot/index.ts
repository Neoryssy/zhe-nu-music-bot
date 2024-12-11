import discordClient from './discordClient'

export const startBot = async () => {
  await discordClient.build()

  return discordClient
}
