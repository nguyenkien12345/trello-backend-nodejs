import express from 'express'
import { ColumnValidation } from '~/validations/ColumnValidation'
import { ColumnController } from '~/controllers/ColumnController'

const Router = express.Router()

Router.route('/')
  .post(ColumnValidation.createColumn, ColumnController.createColumn)

const ColumnRoutes = Router

export { ColumnRoutes }