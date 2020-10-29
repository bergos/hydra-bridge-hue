import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import bridgeHue from './index.js'

const config = {
  hue: {
    host: process.env.HUE_HOST,
    user: process.env.HUE_USER
  }
}

async function main () {
  const app = express()

  app.use(morgan('combined'))
  app.use(cors({
    origin: true,
    credentials: true,
    methods: '*',
    exposedHeaders: ['link']
  }))
  app.use('/hue', await bridgeHue(config))
  app.listen(9000)
}

main()
