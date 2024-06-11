import type { Environment, GlobalLogOptions, LogOptions } from './base';
import type { ITransport } from './transports';

/**
 * Function that accepts a message and optional log options and calls the
 * private log function with a defined level.
 */
export interface LeveledLogMethod {
  (message: string, options?: LogOptions): void;
}

/**
 * Configures the logger instance during creation.
 */
export interface LoggerOptions {
  /**
   * Passes the current environment to the logger, so it can log the
   * appropriate message levels. Ideally the environment is automatically set
   * to match current deployment, e.g. by passing the process.ENV variable.
   */
  environment?: Environment;
  /**
   * Log options that should be passed to every message regardless of transport
   * or log level, e.g. if every message should be tagged with application name.
   */
  globalLogOptions?: GlobalLogOptions;
  /**
   * An array of transport instances the logger send messages to. By default, a
   * console transport will be initiated if no transports are passed here. If
   * any transports are passed, the default will not be initiated and a console
   * transport has to be passed explicitly along with other transports if it is
   * required.
   */
  transports?: ITransport[];
}

/**
 * A logger with a predefined set of logging functions to indicate the severity
 * of the logged message and its consequences for the application.
 */
export interface ILogger {
  /**
   * Used for errors that crash or otherwise hinder the execution of the entire
   * application.
   */
  fatal: LeveledLogMethod;
  /**
   * Used if an error occurred that the application can't recover from or if no
   * sensible default/fallback is possible. Some parts of the application may
   * not work as intended, but other areas are unaffected.
   */
  error: LeveledLogMethod;
  /**
   * Used if something didn't work as expected without affecting the
   * application's ability to function, e.g. recoverable errors with fallbacks
   */
  warn: LeveledLogMethod;
  /**
   * Information that might be useful to the user but does not indicate any
   * error.
   */
  info: LeveledLogMethod;
  /**
   * Default level to print development information.
   */
  debug: LeveledLogMethod;
  /**
   * Most verbose log level. Will print the stack trace even if there was no
   * error. Only use if really detailed information is required.
   */
  trace: LeveledLogMethod;

  /**
   * Returns a new logger instance whose configuration is based on the current
   * logger and the new options.
   *
   * @param options Additional configuration for the derived logger. Will be
   * deepmerged with the options of the parent logger.
   */
  withOptions(options: LoggerOptions): ILogger;
}
