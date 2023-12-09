/* eslint-disable no-useless-catch */
import { ColumnModel } from '~/models/ColumnModel'
import { BoardModel } from '~/models/BoardModel'
import { CardModel } from '~/models/CardModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/middlewares/ApiError'

const createColumn = async (data) => {
  try {
    const createdColumn = await ColumnModel.createColumn({
      ...data
    })
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

const getColumns = async () => {
  try {
    return await ColumnModel.getColumns()
  }
  catch (error) {
    throw error
  }
}

const getDetailColumn = async (id) => {
  try {
    const result = await ColumnModel.getDetailColumn(id)
    if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'column not found')
    return result
  }
  catch (error) {
    throw error
  }
}

const deleteColumn = async (columnId) => {
  try {
    // Cập nhật lại mảng columnOrderIds của Board
    const targetColumn = await ColumnModel.getColumn(columnId)
    if (!targetColumn) throw new ApiError(StatusCodes.NOT_FOUND, 'column not found')
    await BoardModel.pullColumnIdTocolumnOrderIds(targetColumn)
    // Xóa column
    await ColumnModel.deleteColumn(columnId)
    // Xóa các card của column đó đi
    await CardModel.deleteManyCardByColumnId(columnId)
    return { message: 'Column and its Cards deleted successfully' }
  }
  catch (error) {
    throw error
  }
}

const ColumnService = {
  createColumn,
  getColumns,
  getDetailColumn,
  deleteColumn
}

export { ColumnService }
