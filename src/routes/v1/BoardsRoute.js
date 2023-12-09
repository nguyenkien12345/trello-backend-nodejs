import express from 'express'
import { BoardValidation } from '~/validations/BoardValidation'
import { BoardController } from '~/controllers/BoardController'

const Router = express.Router()

Router.route('/')
  .get(BoardController.getBoards)
  .post(BoardValidation.createBoard, BoardController.createBoard)

Router.route('/:id')
  .get(BoardController.getDetailBoard)

const BoardRoutes = Router

export { BoardRoutes }