import { Server as NetServer } from 'http'
import { Server as ServerIO } from 'socket.io'
import { playerListeners } from './listeners/player.listeners'
import { voiceStateListeners } from './listeners/voiceState.listeners'
import { queueListeners } from './listeners/queue.listeners'

export const initializeServerIO = (httpServer: NetServer) => {
  const serverIO = new ServerIO(httpServer, {
    cors: {
      // origin: 'http://localhost:8080',
    },
    path: '/api/socket/io',
    addTrailingSlash: false,
  })

  serverIO.on('connection', (socket) => {
    queueListeners(socket)
    voiceStateListeners(socket)
    playerListeners(socket)
  })

  return serverIO
}
