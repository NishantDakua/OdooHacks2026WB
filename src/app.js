import cors from 'cors'
import express from 'express'

import paymentRoutes from './routes/paymentRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', paymentRoutes)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({
    message: 'Internal server error.',
  })
})

export default app
