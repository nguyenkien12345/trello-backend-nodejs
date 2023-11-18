import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/middlewares/ApiError'

const createBoard = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'title is required',
      'string.empty': 'title is not allowed to be empty',
      'string.min': 'title length must be at least 3 characters long',
      'string.max': 'title length must be less than or equal to 50 characters long',
      'string.trim': 'title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict().messages({
      'any.required': 'description is required',
      'string.empty': 'description is not allowed to be empty',
      'string.min': 'description length must be at least 3 characters long',
      'string.max': 'description length must be less than or equal to 256 characters long',
      'string.trim': 'description must not have leading or trailing whitespace'
    })
  })

  try {
    // abortEarly
    // Nếu abortEarly là true thì khi có lỗi nó sẽ dừng ngay lập tức và trả lỗi luôn để cho người dùng fix trước, sau khi người dùng fix xong nếu còn
    // lỗi tiếp thì nó sẽ trả ra tiếp lần lượt từng lỗi để người dùng fix tiếp cho đến khi hết thì thôi. Ngược lại nếu abortEarly là false thì nó sẽ chạy hết xong show ra toàn bộ lỗi 1 lần luôn
    // VD: Nếu như ta không setup option abortEarly là false thì khi cả title và description validate fail thì nó chỉ hiển thị ra lỗi của title
    // còn nếu ta setup option abortEarly là false thì khi cả title và description validate fail thì nó sẽ hiển thị ra lỗi của cả 2 thằng này luôn
    // thay vì mỗi 1 thằng title thôi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  }
  catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const BoardValidation = {
  createBoard
}

export { BoardValidation }