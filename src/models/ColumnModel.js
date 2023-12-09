import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BoardModel } from './BoardModel'
import { CardModel } from './CardModel'

const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createColumn = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne({
      ...validData,
      boardId: new ObjectId(validData.boardId)
    })
  }
  catch (error) {
    throw new Error(error)
  }
}

const getColumns = async () => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).find({}).toArray()
  }
  catch (error) {
    throw new Error(error)
  }
}

const getColumn = async (id) => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  }
  catch (error) {
    throw new Error(error)
  }
}

const getDetailColumn = async (id) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).aggregate([
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
        from: CardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'columnId',
        as: 'cards'
      } }
    ]).toArray()
    return result[0]
  }
  catch (error) {
    throw new Error(error)
  }
}

const pushCardIdToCardOrderIds = async (card) => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      // Thêm id của card đó vào mảng cardOrderIds của coulumn
      { $push: { cardOrderIds: new ObjectId(card._id) } },
      // returnDocument: 'after' => Nếu không truyền vào flag này thì nó sẽ trả về record trước khi update,
      // còn khi ta gọi returnDocument: 'after' thì nó sẽ trả về record sau khi update
      { returnDocument: 'after' }
    )
  }
  catch (error) {
    throw new Error(error)
  }
}

const pullCardIdToCardOrderIds = async (card) => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      // Thêm id của card đó vào mảng cardOrderIds của coulumn
      { $pull: { cardOrderIds: new ObjectId(card._id) } },
      // returnDocument: 'after' => Nếu không truyền vào flag này thì nó sẽ trả về record trước khi update,
      // còn khi ta gọi returnDocument: 'after' thì nó sẽ trả về record sau khi update
      { returnDocument: 'after' }
    )
  }
  catch (error) {
    throw new Error(error)
  }
}

const deleteColumn = async (id) => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  }
  catch (error) {
    throw new Error(error)
  }
}

const ColumnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createColumn,
  getColumns,
  getColumn,
  getDetailColumn,
  pushCardIdToCardOrderIds,
  pullCardIdToCardOrderIds,
  deleteColumn
}

export { ColumnModel }

// Lý thuyết
// - throw new Error mới trả ra được stack trace lỗi (để biết được cái lỗi xảy ra ở đâu) còn throw error không trả ra stack trace lỗi