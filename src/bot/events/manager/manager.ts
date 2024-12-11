import DiscordMusicBot from '../../../structures/DiscordMusicBot'

export default async (client: DiscordMusicBot) => {
  try {
    client.log.info('Assigning event handlers to manager...')

    if (!client.manager) throw new Error('Manager is undefined')

    client.manager.on('error', (_, error) => {
      client.log.error('Manager occurred an error!')
      client.log.error(error)
    })

    client.manager.on(
      'reconnecting',
      (_, reconnectInterval, triesLeft) => {
        client.log.info(
          `Manager trying to reconnect in ${reconnectInterval}s. Tries left: ${triesLeft}`
        )
      }
    )

    client.manager.on('ready', (_, reconnected) => {
      reconnected
        ? client.log.info('Manager reconnected!')
        : client.log.info('Manager ready!')
    })

    client.manager.on('disconnect', (_, count) => {
      client.log.warn('Websocket Lavalink disconnected!')
    })

    client.manager.on('close', (_, code, reason) => {
      client.log.warn(
        `Websocket Lavalink closed with code ${code}. Reason: ${reason}`
      )
    })

    client.log.info('Event handlers assigned to manager!')
  } catch (error) {
    client.log.error('Event handlers could not be assigned to manager')
    client.log.error(error)
  }
}
