// Đây chính là file quản lý các biến môi trường env. Chỉ có file này mới được phép sử dụng thư viện dotenv
// (Bất cứ file nào muốn sử dụng các biến env phải gọi thông qua file này)

import 'dotenv/config'

const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE // Biến này không được khai báo trong env mà nó được khai báo trong file package.json
}

export { env }

