import { WHITELIST_DOMAINS } from '~/utils/constants'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/middlewares/ApiError'

const corsOptions = {
  origin: function (origin, callback) {
    // origin: Chính là cái domain của front end gọi tới. VD: http://localhost:5173/, http://localhost:1234/

    // Chỉ cho phép việc gọi API bằng POSTMAN trên môi trường develop (Ở môi trường production không cho phép sử dụng postman)
    // Thông thường khi sử dụng postman thì cái origin sẽ có giá trị là undefined.
    if (!origin && env.BUILD_MODE === 'develop') {
      // null nghĩa là không có lỗi, true nghĩa là success (cho phép đi qua (cho phép truy cập tài nguyên))
      return callback(null, true)
    }

    // Kiểm tra xem origin có phải là domain được chấp nhận trong danh sách WHITELIST_DOMAINS hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      // null nghĩa là không có lỗi, true nghĩa là success (cho phép đi qua (cho phép truy cập tài nguyên))
      return callback(null, true)
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },
  // Để nó hoạt động được ở những trình duyệt cũ
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request (Chúng ta thường sẽ đính kèm jwt access token và refresh token vào httpOnly Cookies)
  credentials: true
}

export { corsOptions }
