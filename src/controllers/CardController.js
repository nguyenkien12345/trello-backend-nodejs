import { StatusCodes } from 'http-status-codes'
import { CardService } from '~/services/CardService'

const createCard = async (req, res, next) => {
  try {
    const newCard = await CardService.createCard(req.body)
    res.status(StatusCodes.CREATED).json(newCard)
  }
  catch (error) {
    next(error)
  }
}

const getCards = async (req, res, next) => {
  try {
    const result = await CardService.getCards()
    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

const getDetailCard = async (req, res, next) => {
  try {
    const result = await CardService.getDetailCard(req.params.id)
    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

const deleteCard = async (req, res, next) => {
  try {
    const result = await CardService.deleteCard(req.params.id)
    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

const CardController = {
  createCard,
  getCards,
  getDetailCard,
  deleteCard
}

export { CardController }