/* eslint-disable no-useless-catch */
import { ColumnModel } from '~/models/ColumnModel'
import { BoardModel } from '~/models/BoardModel'

const createColumn = async (data) => {
  try {
    const newColumn = {
      ...data
    }
    const createdColumn = await ColumnModel.createColumn(newColumn)

    const result = await ColumnModel.getColumn(createdColumn.insertedId)

    if (result) {
      result.cards = []
      // Cập nhật lại field columnOrderIds của Board có id bằng với boardId của column được tạo này
      await BoardModel.pushColumnIdTocolumnOrderIds(result)
    }
    return result
  }
  catch (error) {
    throw error
  }
}

const ColumnService = {
  createColumn
}

export { ColumnService }
