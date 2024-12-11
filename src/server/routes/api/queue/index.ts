import { Router } from 'express'
import { DiscordTrack, IDiscordTrack } from '../../../../structures/Dispatcher'
import discordClient from '../../../../bot/discordClient'

const router = Router()

router.post('/:id/enqueue', async (req, res) => {
  try {
    const body = req.body as IDiscordTrack & { userId: string }
    const guildId = req.params.id
    const guild = discordClient.guilds.cache.get(guildId)

    if (!guild) {
      return res.status(404).json({ message: 'Guild not found' })
    }

    const member = await guild.members.fetch(body.userId)

    if (!member) {
      return res.status(404).json({ message: 'Guild member not found' })
    }

    const track = new DiscordTrack({
      ...body,
      requester: member,
    })

    const dispatcher = discordClient.subscription.get(guildId)

    if (!dispatcher) {
      return res.status(200).end()
    }

    dispatcher.enqueue(track)
    await dispatcher.tryPlay()

    res.status(200).end()
  } catch (error) {
    console.log('[PLAYER_POST]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
})

export default router
