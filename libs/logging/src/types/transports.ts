import type {
  Environment,
  EnvironmentLevelMap,
  ExecutionContext,
  GlobalLogOptions,
  LogLevel,
  LogOptions,
} from './base';

/**
 * Configuration for a transport instance
 */
export interface TransportOptions {
  /**
   * Optional environment level map for this transport instance. If none is
   * provided the default environment level map of the transport will be used
   * instead.
   */
  environmentLevelMap?: EnvironmentLevelMap;
  /**
   * Log options that will be applied to all messages logged with this
   * transport. These options are deepmerged with the GlobalLogOptions of the
   * logger.
   */
  transportLogOptions?: GlobalLogOptions;
}

/**
 * A transport for the logger, capable of setting itself up with the provided
 * configuration and sending messages of all log levels.
 */
export interface ITransport {
  /**
   * Called when a logger is derived from via its withOptions() function to
   * copy the transports if no new transports are initialized. Should return a
   * cloned copy of the transport with identical settings but no references.
   */
  clone: () => ITransport;
  /**
   * Called if the transport is active in a logger and a message is logged.
   * Should implement the tranport's handling of the message.
   *
   * @param level The log level of the message
   * @param message The actual message
   * @param options Any log options specific to a single message. Should be
   * merged with options from the transport and the logger's global options.
   */
  send: (level: LogLevel, message: string, options?: LogOptions) => void;

  /**
   * Called when the logger is initialized. Should perform any required setup
   * for the transport.
   *
   * @param executionContext Execution context the parent logger is running in
   * @param environment Environment the parent logger is running in
   * @param globalLogOptions GlobalLogOptions of the parent logger. Should be
   * deepmerged with the transport's own GlobalLogOptions.
   */
  setup: (executionContext: ExecutionContext, environment: Environment, globalLogOptions: GlobalLogOptions) => void;
}
