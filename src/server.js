/* eslint-disable no-console */ // Cho phép sủ dụng console.log ở toàn bộ file này
import express from 'express'
import exitHook from 'async-exit-hook'
import cors from 'cors'
import { env } from '~/config/environment'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { APIsV1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { corsOptions } from '~/config/cors'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIsV1)

  app.use(errorHandlingMiddleware)


  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}`)
  })

  // Xử lý các sự kiện liên quan đến đóng kết nối MongoDB Atlas như `exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`
  // Lưu ý: Luôn khai báo dưới sự kiện app listen. Nó sẽ thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('Disconnecting from MongoDB Cloud Atlas...')
    CLOSE_DB()
    console.log('Disconnected from MongoDB Cloud Atlas !')
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
    process.exit(0)
  }
})()