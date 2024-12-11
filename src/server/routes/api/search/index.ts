import { Router } from 'express'
import discordClient from '../../../../bot/discordClient'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const query = req.query.q as string

    const lavaLinkResponse = await discordClient.subscription.search(query)

    res.status(200).json(lavaLinkResponse)
  } catch (error) {
    console.log('[PLAYER_GET]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
})

export default router
