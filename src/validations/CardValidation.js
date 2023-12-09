import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/middlewares/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createCard = async (req, res, next) => {
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
    }),
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  }
  catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const CardValidation = {
  createCard
}

export { CardValidation }