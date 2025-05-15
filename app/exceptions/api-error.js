module.exports = class ApiError extends Error {
  status;

  constructor(status, message) {
    super();
    this.message = message;
    this.status = status;
  }

  static BadRequest(message, data = [], errors = []) {
    return new ApiError(400, message ?? "Invalid request", errors, data);
  }

  static UnauthorizedError(message) {
    return new ApiError(401, message ?? "User is not authorized!");
  }

  static Forbidden(message) {
    return new ApiError(403, message ?? "User is not allowed to access this resource!");
  }

  static NotFound(message) {
    return new ApiError(404, message ?? "Resource not found!");
  }

  static Conflict(message) {
    return new ApiError(409, message ?? "Resource already exists!");
  }

  static InternalServerError() {
    return new ApiError(500, "Internal server error!");
  }
};