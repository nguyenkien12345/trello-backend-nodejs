
import { StatusCodes } from 'http-status-codes'
import { BoardService } from '~/services/BoardService'

const createBoard = async (req, res, next) => {
  try {
    const newBoard = await BoardService.createBoard(req.body)
    res.status(StatusCodes.CREATED).json(newBoard)
  }
  catch (error) {
    next(error)
  }
}

const BoardController = {
  createBoard
}

export { BoardController }