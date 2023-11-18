/* eslint-disable no-unused-vars */ // Có 1 vài biến chúng ta khai báo nhưng không sử dụng thì nó sẽ không báo lỗi (Sử dụng ở toàn bộ file này)
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
const errorHandlingMiddleware = (err, req, res, next) => {

  // Nếu chúng ta không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR 
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code. Vd ReasonPhrases của lỗi 500 là INTERNAL_SERVER_ERROR
    stack: err.stack
  }

  // Nếu môi trường là develop thì trong object responseError sẽ có thêm field stack. Ngược lại nếu môi trường không phải là develop thì chúng ta sẽ xóa field stack
  // ra khỏi object responseError
  if (env.BUILD_MODE !== 'develop') delete responseError.stack

  // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group Slack, Telegram, Email...vv
  // Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.

  res.status(responseError.statusCode).json(responseError)
}

export { errorHandlingMiddleware }