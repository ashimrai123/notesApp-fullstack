import BaseError from './baseError';

export default class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
