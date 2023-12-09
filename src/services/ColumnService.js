/* eslint-disable no-useless-catch */
import { ColumnModel } from '~/models/ColumnModel'

const createColumn = async (data) => {
  try {
    const newColumn = {
      ...data
    }
    const createdColumn = await ColumnModel.createColumn(newColumn)
    const result = await ColumnModel.getColumn(createdColumn.insertedId)
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
