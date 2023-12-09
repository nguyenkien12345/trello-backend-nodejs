import express from 'express'
import { CardValidation } from '~/validations/CardValidation'
import { CardController } from '~/controllers/CardController'

const Router = express.Router()

Router.route('/')
  .post(CardValidation.createCard, CardController.createCard)

const CardRoutes = Router

export { CardRoutes }