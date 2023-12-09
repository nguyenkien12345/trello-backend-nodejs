import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { ColumnModel } from '~/models/ColumnModel'
import { CardModel } from '~/models/CardModel'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
})

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createBoard = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
  }
  catch (error) {
    throw new Error(error)
  }
}

const getBoards = async () => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).find()
  }
  catch (error) {
    throw new Error(error)
  }
}

const getBoard = async (id) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  }
  catch (error) {
    throw new Error(error)
  }
}

const getDetailBoard = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(id),
        _destroy: false
      } },
      { $lookup: {
        // Đi tìm những records trong models Column mà có khóa ngoại boardId bằng với khóa chính _id của models Board. Dữ liệu sẽ được trả về trong field columns
        from: ColumnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup: {
        // Đi tìm những records trong models Card mà có khóa ngoại boardId bằng với khóa chính _id của models Board. Dữ liệu sẽ được trả về trong field cards
        from: CardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } }
    ]).toArray()
    return result[0]
  }
  catch (error) {
    throw new Error(error)
  }
}

const pushColumnIdTocolumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      // Thêm id của column đó vào mảng columnOrderIds của board
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      // returnDocument: 'after' => Nếu không truyền vào flag này thì nó sẽ trả về record trước khi update,
      // còn khi ta gọi returnDocument: 'after' thì nó sẽ trả về record sau khi update
      { returnDocument: 'after' }
    )
    return result.value
  }
  catch (error) {
    throw new Error(error)
  }
}

const BoardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createBoard,
  getBoards,
  getBoard,
  getDetailBoard,
  pushColumnIdTocolumnOrderIds
}

export { BoardModel }

// Lý thuyết
// - throw new Error mới trả ra được stack trace lỗi (để biết được cái lỗi xảy ra ở đâu) còn throw error không trả ra stack trace lỗi
