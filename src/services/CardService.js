/* eslint-disable no-useless-catch */
import { CardModel } from '~/models/CardModel'

const createCard = async (data) => {
  try {
    const newCard = {
      ...data
    }
    const createdCard = await CardModel.createCard(newCard)
    const result = await CardModel.getCard(createdCard.insertedId)
    return result
  }
  catch (error) {
    throw error
  }
}

const CardService = {
  createCard
}

export { CardService }
