import { PermissionFlagsBits } from 'discord.js'
import discordClient from '../bot/discordClient'

type RESTPartialGuild = {
  bot: boolean
  bot_master: boolean
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
}

export const fetchGuilds = async (authorization: string) => {
  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: authorization },
  })

  const data = await response.json()

  return { response, data }
}

export const fetchUserData = async (authorization: string) => {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: authorization },
  })

  const data = await response.json()

  return { response, data }
}

export const getClientGuildsWithUser = async (userId: string) => {
  const managedGuilds: RESTPartialGuild[] = []

  for (const [_, guild] of discordClient.guilds.cache) {
    const member = await guild.members.fetch(userId).catch(() => undefined)

    if (!member) {
      continue
    }

    if (!managedGuilds.find((m) => m.id === guild.id)) {
      const owner = guild.ownerId === userId
      const managedGuild: RESTPartialGuild = {
        bot: true,
        bot_master: member.permissions.has(PermissionFlagsBits.ManageGuild),
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        owner: owner,
        permissions: member.permissions.toJSON(),
      }

      managedGuilds.push(managedGuild)
    }
  }

  return managedGuilds
}

export function hasGuildPermission(
  permissions: number | string,
  permissionToCheck: bigint
) {
  const bigIntPermissions = BigInt(permissions)
  return (bigIntPermissions & permissionToCheck) === permissionToCheck
}

export const processManagedGuilds = (
  guilds: {
    id: string
    name: string
    icon: string | null
    owner: boolean
    permissions_new: string
  }[]
) => {
  const managedGuilds = []

  for (const guild of guilds) {
    if (
      !hasGuildPermission(
        guild.permissions_new,
        PermissionFlagsBits.ManageGuild
      )
    ) {
      continue
    }

    const managedGuild = {
      bot: discordClient.guilds.cache.has(guild.id),
      bot_master: true,
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: guild.owner,
      permissions: guild.permissions_new,
    }

    managedGuilds.push(managedGuild)
  }

  return managedGuilds
}
