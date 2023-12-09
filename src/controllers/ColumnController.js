import { StatusCodes } from 'http-status-codes'
import { ColumnService } from '~/services/ColumnService'

const createColumn = async (req, res, next) => {
  try {
    const newColumn = await ColumnService.createColumn(req.body)
    res.status(StatusCodes.CREATED).json(newColumn)
  }
  catch (error) {
    next(error)
  }
}

const ColumnController = {
  createColumn
}

export { ColumnController }