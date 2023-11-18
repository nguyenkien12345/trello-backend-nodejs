import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { BoardValidation } from '~/validations/BoardValidation'
import { BoardController } from '~/controllers/BoardController'

const Router = express.Router()

Router.route('/')
  .get((req, res, next) => {
    res.status(StatusCodes.OK).json({ message: 'API get list board' })
  })
  .post(BoardValidation.createBoard, BoardController.createBoard)

Router.route('/:id')
  .get(BoardController.getDetailBoard)

const BoardRoutes = Router

export { BoardRoutes }