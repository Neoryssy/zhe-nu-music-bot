import connectToMongoDB from '../utils/connectToMongoDB'
import { httpServer } from './server'

export const startServer = async () => {
  const port = process.env.PORT || 3000

  await connectToMongoDB()

  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}
