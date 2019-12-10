import { Router } from "express";

const router = Router()

// routes.use('/auth', auth)

router.get('/ping', (req, res) => {
  res.send('pong')
})

export default router
