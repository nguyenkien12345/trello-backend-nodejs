import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

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
  const result = await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  return result
}

const createColumn = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne({
      ...validData,
      boardId: new ObjectId(validData.boardId)
    })
    return newColumn
  }
  catch (error) {
    throw new Error(error)
  }
}

const getColumn = async (id) => {
  try {
    const column = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return column
  }
  catch (error) {
    throw new Error(error)
  }
}

const pushCardIdToCardOrderIds = async (card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      // Thêm id của card đó vào mảng cardOrderIds của coulumn
      { $push: { cardOrderIds: new ObjectId(card._id) } },
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

const ColumnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createColumn,
  getColumn,
  pushCardIdToCardOrderIds
}

export { ColumnModel }

// Lý thuyết
// - throw new Error mới trả ra được stack trace lỗi (để biết được cái lỗi xảy ra ở đâu) còn throw error không trả ra stack trace lỗi