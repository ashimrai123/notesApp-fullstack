import { NextFunction, Request, Response } from 'express';
import logger from './logger';
import BaseError from '../errors/baseError';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.stack);

  if (err instanceof BaseError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

export default errorHandler;
