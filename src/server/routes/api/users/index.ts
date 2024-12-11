import { Router } from 'express'
import discordClient from '../../../../bot/discordClient'
import { User } from 'discord.js'
import {
  fetchGuilds,
  fetchUserData,
  getClientGuildsWithUser,
  processManagedGuilds,
} from '../../../../utils/guilds'

const router = Router()

router.get('/@client', (req, res) => {
  try {
    const user = discordClient.user

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.log('[USER_GET]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
})

router.get('/@client/guilds', (req, res) => {
  try {
    const guilds = discordClient.guilds.cache

    return res.status(200).json(guilds)
  } catch (error) {
    console.log('[GUILDS_GET]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
})

router.get('/@me', async (req, res) => {
  const { headers } = req
  const { authorization } = headers

  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: authorization,
      },
    })
    const data = await response.json()

    if (response.status !== 200) {
      return res.status(response.status).json({ message: data.message })
    }

    const user = (await discordClient.users.fetch(data.id)) as User

    return res.status(200).json(user)
  } catch (error) {
    console.log('[USER_GET]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
})

router.get('/@me/managed-guilds', async (req, res) => {
  const { headers } = req
  const { authorization } = headers

  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const { response: guildsResponse, data: guildsData } = await fetchGuilds(
      authorization
    )

    if (guildsResponse.status !== 200) {
      return res
        .status(guildsResponse.status)
        .json({ message: guildsData.message })
    }

    const { response: userResponse, data: userData } = await fetchUserData(
      authorization
    )

    if (userResponse.status !== 200) {
      return res.status(userResponse.status).json({ message: userData.message })
    }

    const managedGuilds = [...processManagedGuilds(guildsData)]

    for (const guild of await getClientGuildsWithUser(userData.id)) {
      if (!managedGuilds.find((m) => m.id === guild.id)) {
        managedGuilds.push(guild)
      }
    }

    return res.status(200).json(managedGuilds)
  } catch (error) {
    console.log('[USER_GET]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
})

export default router
