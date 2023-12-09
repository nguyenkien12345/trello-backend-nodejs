import express from 'express'
import { CardValidation } from '~/validations/CardValidation'
import { CardController } from '~/controllers/CardController'

const Router = express.Router()

Router.route('/')
  .get(CardController.getCards)
  .post(CardValidation.createCard, CardController.createCard)

Router.route('/:id')
  .get(CardController.getDetailCard)
  .delete(CardValidation.deleteCard, CardController.deleteCard)

const CardRoutes = Router

export { CardRoutes }