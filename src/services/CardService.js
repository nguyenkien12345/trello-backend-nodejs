/* eslint-disable no-useless-catch */
import { CardModel } from '~/models/CardModel'
import { ColumnModel } from '~/models/ColumnModel'

const createCard = async (data) => {
  try {
    const newCard = {
      ...data
    }
    const createdCard = await CardModel.createCard(newCard)

    const result = await CardModel.getCard(createdCard.insertedId)

    if (result) {
      // Cập nhật lại field cardOrderIds của Column có id bằng với columnId của card được tạo này
      await ColumnModel.pushCardIdToCardOrderIds(result)
    }
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
