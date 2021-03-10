export default class AppError extends Error {
  constructor({ name = null, message = null, ...rest }) {
    super();
    this.name = name || this.constructor.name;
    this.message = message || 'Something bad happened';
    this.info = rest;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
