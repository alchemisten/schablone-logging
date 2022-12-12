/**
 * The levels a message can be logged at. For each of these levels a dedicated
 * logging functions exists on the logger instance.
 */
export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * The potential environments the logger can be run in. 'never' is a convenience
 * value to be used in the EnvironmentLevelMap to completely disable certain log
 * levels and should not be used as an actual environment. Environments have an
 * order with 'production' being the lowest order environment and 'never' being
 * the highest.
 */
export type Environment = 'never' | 'local' | 'develop' | 'staging' | 'production';

/**
 * Defines for each log level in which environment it should still be logged.
 * Each log level will also be logged in higher order environments, but never
 * in lower order environments. Thus, a log level set to 'production' will be
 * logged on any other environment, but a log level set to 'never' won't be
 * logged at all.
 */
export type EnvironmentLevelMap = {
  [key in LogLevel]?: Environment;
};

/**
 * The execution context defaults to 'browser' and switches automatically to
 * node if the 'window' global is not available. Used to control certain
 * features that might not be available in one of the available contexts.
 */
export type ExecutionContext = 'node' | 'browser';

/**
 * Defines an optional coloring function for each log level.
 */
export type ColorLevelMap = {
  [key in LogLevel]: (message: string) => string;
};

/**
 * Defines a color map for each execution context.
 */
export type ExecutionContextColorMap = {
  [key in ExecutionContext]: ColorLevelMap;
};

/**
 * Data available in a log callback. Contains the log level, message and any
 * options passed to the log except for tags.
 */
export interface CallbackData {
  /**
   * Optionally provided error object. Only present if it was explicitly passed
   * to the log, even if the level was 'error' or 'fatal'.
   */
  error?: unknown;
  /**
   * Level of the log message
   */
  level: string;
  /**
   * The actual message that was logged
   */
  message: string;
  /**
   * Optional structured data passed to the log
   */
  meta?: unknown;
  /**
   * Any optional objects passed to the log
   */
  objects?: unknown | unknown[];
}

/**
 * Optional callback that will be run after a message is logged. Receives the
 * log level and message and any options passed to the log except for tags.
 */
export type LogCallback = (data: CallbackData) => void;

/**
 * Used to pass structured data to a callback or the sentry transport. Won't
 * get logged in the console transport.
 */
export type LogMetaInformation = Record<string, unknown>;

/**
 * Tags can be used to give additional structure to logs for easier filtering
 * or to visually identify logs of different levels with commonalities.
 */
export type LogTags = Record<string, string>;

/**
 * Additional options for a log call.
 */
export interface LogOptions {
  /**
   * A function run after a message is logged. Receives the log level and
   * message and any options passed to the log except for tags.
   */
  callback?: LogCallback;
  /**
   * Used to pass structured data to a callback or the sentry transport. Won't
   * get logged in the console transport.
   */
  meta?: LogMetaInformation;
  /**
   * Object or array of objects that will be logged along with the message. The
   * objects are stringified in the 'node' execution context. Objects won't be
   * passed with the sentry transport. Use meta to pass structured data to
   * sentry.
   */
  objects?: unknown | unknown[];
  /**
   * Tags can be used to give additional structure to logs for easier filtering
   * or to visually identify logs of different levels with commonalities. Will
   * be logged as [key:value|key:value] before the log level in the message.
   */
  tags?: LogTags;
  /**
   * Used to pass an error object to a log and distinguish it from other
   * objects.
   */
  error?: unknown;
}

/**
 * Options passed to the entire logger or a single transport. These options are
 * a subset of the options passed to a log and will be combined with them. Used
 * to set options that should affect each log or each log in a transport.
 */
export type GlobalLogOptions = Pick<LogOptions, 'tags' | 'meta' | 'callback'>;
