/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { slugify } from '~/config/formatter'
import ApiError from '~/middlewares/ApiError'
import { BoardModel } from '~/models/BoardModel'

const createBoard = async (data) => {
  try {
    const newBoard = {
      ...data,
      slug: slugify(data.title)
    }
    const createdBoard = await BoardModel.createBoard(newBoard)
    const result = await BoardModel.getBoard(createdBoard.insertedId)
    return result
  }
  catch (error) {
    throw error
  }
}

const getDetailBoard = async (id) => {
  try {
    const result = await BoardModel.getDetailBoard(id)

    if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'board not found')

    return result
  }
  catch (error) {
    throw error
  }
}

const BoardService = {
  createBoard,
  getDetailBoard
}

export { BoardService }
