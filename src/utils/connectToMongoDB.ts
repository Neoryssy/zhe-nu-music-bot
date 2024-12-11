import mongoose, { MongooseError } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

export default async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }

  let currentRetry = 0
  const maxRetries = 5
  const tryDelay = 5000

  while (currentRetry <= maxRetries) {
    try {
      await mongoose.connect(MONGODB_URI)

      console.log('Connected to MongoDB')
      break
    } catch (error) {
      if (currentRetry === maxRetries) {
        throw error
      }

      console.log(
        `Error to connect to MongoDB. Trying to reconnect in ${tryDelay}ms. Tries left: ${
          maxRetries - currentRetry
        }`
      )

      currentRetry++

      await new Promise((resolve) => setTimeout(resolve, tryDelay))
    }
  }

  console.log('Connected to MongoDB')
}
