import express from 'express'
import { ColumnValidation } from '~/validations/ColumnValidation'
import { ColumnController } from '~/controllers/ColumnController'

const Router = express.Router()

Router.route('/')
  .get(ColumnController.getColumns)
  .post(ColumnValidation.createColumn, ColumnController.createColumn)

Router.route('/:id')
  .get(ColumnController.getDetailColumn)
  .delete(ColumnValidation.deleteColumn, ColumnController.deleteColumn)

const ColumnRoutes = Router

export { ColumnRoutes }