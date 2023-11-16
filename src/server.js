/* eslint-disable no-console */ // Cho phép sủ dụng console.log ở toàn bộ file này
import express from 'express'
import { CONNECT_DB, GET_DB } from '~/config/mongodb'
import { env } from '~/config/environment'

const START_SERVER = () => {
  const app = express()


  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}`)
  })
}

(async () => {
  try {
    console.log('Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('Connected to MongoDB Cloud Atlas Success !')
    START_SERVER()
  }
  catch (error) {
    console.error(`Connected to MongoDB Cloud Atlas Fail: ${JSON.stringify(error)}!`)
  }
})()