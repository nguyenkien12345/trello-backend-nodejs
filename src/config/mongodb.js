import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let trelloDatabaseInstance = null

const client = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true, // Khi chúng ta gọi 1 lệnh/hành động nào đấy bất kể mà nó không thuộc phiên bản api version của mongodb này thì nó sẽ báo lỗi
    deprecationErrors: true // VD Chúng ta đang sử dụng version 7 mà chúng gọi 1 method/function nào đó của version 6 mà nó không còn tồn tại nữa ở version 7 thì nó sẽ báo lỗi
  }
})

const CONNECT_DB = async () => {
  await client.connect()
  trelloDatabaseInstance = client.db(env.DATABASE_NAME)
}

const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Please Must Connect To Database First')
  return trelloDatabaseInstance
}

const CLOSE_DB = async () => {
  await client.close()
}

export { CONNECT_DB, GET_DB, CLOSE_DB }