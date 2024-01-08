import BaseError from './baseError';

export default class UnauthenticatedError extends BaseError {
  constructor() {
    super('Unauthenticated');
  }
}
