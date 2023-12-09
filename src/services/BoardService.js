/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { slugify } from '~/config/formatter'
import ApiError from '~/middlewares/ApiError'
import { BoardModel } from '~/models/BoardModel'
import { cloneDeep } from 'lodash'

const createBoard = async (data) => {
  try {
    const createdBoard = await BoardModel.createBoard({
      ...data,
      slug: slugify(data.title)
    })
    return await BoardModel.getBoard(createdBoard.insertedId)
  }
  catch (error) {
    throw error
  }
}

const getBoards = async () => {
  try {
    return await BoardModel.getBoards()
  }
  catch (error) {
    throw error
  }
}

const getDetailBoard = async (id) => {
  try {
    const result = await BoardModel.getDetailBoard(id)
    if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'board not found')
    // Giả sử chúng ta đang có dữ liệu trả về của biến result là:
    // {
    //   "_id": "6571e303ee04abac6451273f",
    //   "title": "MAI THI THANH THUY",
    //   "description": "NGUYEN TRUNG KIEN VS MAI THI THANH THUY",
    //   "type": "public",
    //   "slug": "mai-thi-thanh-thuy",
    //   "columnOrderIds": [],
    //   "createdAt": 1701962499379,
    //   "updatedAt": null,
    //   "_destroy": false,
    //   "columns": [
    //       {
    //           "_id": "6571e33335e4bf1708dbc6ec",
    //           "boardId": "6571e303ee04abac6451273f",
    //           "title": "This is column 01",
    //           "cardOrderIds": [
    //               "6571e4b135e4bf1708dbc6ee"
    //           ]
    //       }
    //   ],
    //   "cards": [
    //       {
    //           "_id": "6571e4b135e4bf1708dbc6ee",
    //           "boardId": "6571e303ee04abac6451273f",
    //           "columnId": "6571e33335e4bf1708dbc6ec",
    //           "title": "Đây là tiêu đề của card số 01",
    //           "description": "Đây là mô tả của card số 01"
    //       }
    //   ]
    // }

    // Chúng ta thấy 2 dữ liệu columns và cards đang nằm ngang hàng (cùng cấp với nhau). Chúng ta sẽ cập nhật lại
    // là đưa cái cards vào bên trong columns. Chúng ta muốn cards phải là con của columns

    // cloneDeep: Tạo ra một biến mới từ một biến trước đó, hoàn toàn không ảnh hưởng và dính dáng gì đến biến trước đó
    // Chúng ta không nên chỉnh sửa dữ liệu ban đầu thay vào đó nên tạo ra một đối tượng mới từ đối tượng ban đầu
    const cloneResponseBoard = cloneDeep(result)
    cloneResponseBoard.columns.forEach((column) => {
      // Thêm cards vào trong từng cái column bằng cách gắn biến cards vào column
      // Cách 1
      // column.cards = cloneResponseBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
      // Cách 2
      column.cards = cloneResponseBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    // Sau khi đã đưa cái cards vào trong columns xong thì chúng ta nên xóa cái cards đang nằm song song cùng cấp với columns đi
    delete cloneResponseBoard.cards
    // Lúc này kết quả mới của chúng ta là:
    // {
    //   "_id": "6571e303ee04abac6451273f",
    //   "title": "MAI THI THANH THUY",
    //   "description": "NGUYEN TRUNG KIEN VS MAI THI THANH THUY",
    //   "type": "public",
    //   "slug": "mai-thi-thanh-thuy",
    //   "columnOrderIds": [],
    //   "createdAt": 1701962499379,
    //   "updatedAt": null,
    //   "_destroy": false,
    //   "columns": [
    //       {
    //           "_id": "6571e33335e4bf1708dbc6ec",
    //           "boardId": "6571e303ee04abac6451273f",
    //           "title": "This is column 01",
    //           "cardOrderIds": [
    //               "6571e4b135e4bf1708dbc6ee"
    //           ],
    //           "cards": [
    //               {
    //                   "_id": "6571e4b135e4bf1708dbc6ee",
    //                   "boardId": "6571e303ee04abac6451273f",
    //                   "columnId": "6571e33335e4bf1708dbc6ec",
    //                   "title": "Đây là tiêu đề của card số 01",
    //                   "description": "Đây là mô tả của card số 01"
    //               }
    //           ]
    //       }
    //   ]
    // }

    return cloneResponseBoard
  }
  catch (error) {
    throw error
  }
}

const updateBoard = async (id, data) => {
  try {
    return await BoardModel.updateBoard(
      id,
      {
        ...data,
        updatedAt: Date.now()
      }
    )
  }
  catch (error) {
    throw error
  }
}

const BoardService = {
  createBoard,
  getBoards,
  getDetailBoard,
  updateBoard
}

export { BoardService }
