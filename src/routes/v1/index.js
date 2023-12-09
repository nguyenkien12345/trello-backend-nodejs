import express from 'express'
import { BoardRoutes } from './BoardsRoute'
import { ColumnRoutes } from './ColumnsRoute'
import { CardRoutes } from './CardsRoute'

const Router = express.Router()

Router.use('/boards', BoardRoutes)
Router.use('/columns', ColumnRoutes)
Router.use('/cards', CardRoutes)

const APIsV1 = Router

export { APIsV1 }
