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

const CardController = {
  createCard
}

export { CardController }