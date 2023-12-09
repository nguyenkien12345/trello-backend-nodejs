/* eslint-disable no-useless-catch */
import { CardModel } from '~/models/CardModel'
import { ColumnModel } from '~/models/ColumnModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/middlewares/ApiError'

const createCard = async (data) => {
  try {
    const createdCard = await CardModel.createCard({
      ...data
    })
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

const getCards = async () => {
  try {
    return await CardModel.getCards()
  }
  catch (error) {
    throw error
  }
}

const getDetailCard = async (id) => {
  try {
    const result = await CardModel.getDetailCard(id)
    if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'card not found')
    return result
  }
  catch (error) {
    throw error
  }
}

const deleteCard = async (cardId) => {
  try {
    // Cập nhật lại mảng cardOrderIds của Column
    const targetCard = await CardModel.getCard(cardId)
    if (!targetCard) throw new ApiError(StatusCodes.NOT_FOUND, 'card not found')
    await ColumnModel.pullCardIdToCardOrderIds(targetCard)
    // Xóa Card
    await CardModel.deleteCard(cardId)
  }
  catch (error) {
    throw error
  }
}

const CardService = {
  createCard,
  getCards,
  getDetailCard,
  deleteCard
}

export { CardService }
