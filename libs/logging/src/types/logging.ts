import { Environment, GlobalLogOptions, LogOptions } from './base';
import { ITransport } from './transports';

export interface LeveledLogMethod {
  (message: string, options?: LogOptions): void;
}

export interface LoggerOptions {
  environment?: Environment;
  globalLogOptions?: GlobalLogOptions;
  transports?: ITransport[];
}

/**
 * Reduced interface for exchange ability
 */
export interface ILogger {
  fatal: LeveledLogMethod;
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  info: LeveledLogMethod;
  debug: LeveledLogMethod;
  trace: LeveledLogMethod;

  withOptions(options: LoggerOptions): ILogger;
}
