import { Logger } from './logger';
import { ILogger, LoggerOptions } from '../types';

/**
 * Returns an instance of a logger, configured with the provided options.
 *
 * @param options Configuration for the logger. Should usually at least contain
 * the current environment, which will default to 'production' otherwise.
 */
export const LoggerFactory = (options?: LoggerOptions): ILogger => {
  return new Logger(options);
};
