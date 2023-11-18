import express from 'express'
import { BoardRoutes } from './BoardsRoute'

const Router = express.Router()

Router.use('/boards', BoardRoutes)

const APIsV1 = Router

export { APIsV1 }
