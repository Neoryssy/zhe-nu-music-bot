import { Router } from 'express'

const router = Router()

router.get('/guild-oauth', async (req, res) => {
  const { code, guild_id } = req.query

  if (!code) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return
  }

  res.write(`
    <script>
      window.close();
      window.opener.postMessage({ type: 'CHANGE_URL', url: '/dashboard/${guild_id}'}, '*');
    </script>
  `)

  res.end()
})

export default router
