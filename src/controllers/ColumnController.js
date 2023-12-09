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

const getColumns = async (req, res, next) => {
  try {
    const result = await ColumnService.getColumns()
    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

const getDetailColumn = async (req, res, next) => {
  try {
    const result = await ColumnService.getDetailColumn(req.params.id)
    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

const deleteColumn = async (req, res, next) => {
  try {
    const result = await ColumnService.deleteColumn(req.params.id)
    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

const ColumnController = {
  createColumn,
  getColumns,
  getDetailColumn,
  deleteColumn
}

export { ColumnController }