import { Logger } from './logger';
import { ILogger, LoggerOptions } from '../types';

export const LoggerFactory = (options?: LoggerOptions): ILogger => {
  return new Logger(options);
};
