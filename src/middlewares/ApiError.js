/**
 * Định nghĩa riêng một Class ApiError kế thừa class Error sẵn có của JS
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    // Gọi tới hàm khởi tạo của class Error (class cha) để còn dùng this
    // Thằng cha (Error) có property message rồi nên gọi nó luôn trong super cho gọn
    // Lưu ý: Phải có super mới dùng được this
    super(message)

    // Tên của cái custom Error này, nếu không set thì mặc định nó sẽ kế thừa là "Error"
    this.name = 'ApiError'

    // Gán thêm http status code của chúng ta ở đây
    this.statusCode = statusCode

    // Ghi lại Stack Trace (dấu vết ngăn xếp) để thuận tiện cho việc debug
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError