import dotenv from 'dotenv'
dotenv.config()
import { startBot } from './bot'
import { startServer } from './server'

const main = async () => {
  await startServer()
  await startBot()
}

main()
