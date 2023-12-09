import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  const result = await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  return result
}

const createCard = async (data) => {
  try {
    // Luôn luôn validate data ở tầng model trước khi tạo 1 đối tượng
    const validData = await validateBeforeCreate(data)
    const newCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(validData)
    return newCard
  }
  catch (error) {
    // throw new Error mới trả ra được stack trace lỗi (để biết được cái lỗi xảy ra ở đâu) còn throw error không trả ra stack trace lỗi
    throw new Error(error)
  }
}

const getCard = async (id) => {
  try {
    const card = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return card
  }
  catch (error) {
    // throw new Error mới trả ra được stack trace lỗi (để biết được cái lỗi xảy ra ở đâu) còn throw error không trả ra stack trace lỗi
    throw new Error(error)
  }
}

const CardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createCard,
  getCard
}

export { CardModel }