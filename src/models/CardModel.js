import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BoardModel } from './BoardModel'
import { ColumnModel } from './ColumnModel'

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
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createCard = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne({
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    })
  }
  catch (error) {
    throw new Error(error)
  }
}

const getCards = async () => {
  try {
    return await GET_DB().collection(CARD_COLLECTION_NAME).find({}).toArray()
  }
  catch (error) {
    throw new Error(error)
  }
}

const getCard = async (id) => {
  try {
    return await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  }
  catch (error) {
    throw new Error(error)
  }
}

const getDetailCard = async (id) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(id),
        _destroy: false
      } },
      { $lookup: {
        from: BoardModel.BOARD_COLLECTION_NAME,
        localField: 'boardId',
        foreignField: '_id',
        as: 'board'
      } },
      { $lookup: {
        from: ColumnModel.COLUMN_COLLECTION_NAME,
        localField: 'columnId',
        foreignField: '_id',
        as: 'column'
      } }
    ]).toArray()
    return result[0]
  }
  catch (error) {
    throw new Error(error)
  }
}

const deleteManyCardByColumnId = async (columnId) => {
  try {
    return await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({ columnId: new ObjectId(columnId) })
  }
  catch (error) {
    throw new Error(error)
  }
}

const deleteCard = async (id) => {
  try {
    return await GET_DB().collection(CARD_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  }
  catch (error) {
    throw new Error(error)
  }
}

const CardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createCard,
  getCards,
  getCard,
  getDetailCard,
  deleteManyCardByColumnId,
  deleteCard
}

export { CardModel }

// Lý thuyết
// - throw new Error mới trả ra được stack trace lỗi (để biết được cái lỗi xảy ra ở đâu) còn throw error không trả ra stack trace lỗi