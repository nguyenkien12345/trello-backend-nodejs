/* eslint-disable no-useless-catch */
import { slugify } from '~/config/formatter'

const createBoard = async (data) => {
  try {
    const newBoard = {
      ...data,
      slug: slugify(data.title)
    }

    return newBoard
  }
  catch (error) {
    throw error
  }
}

const BoardService = {
  createBoard
}

export { BoardService }
