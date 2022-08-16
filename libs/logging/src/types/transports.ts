import { Environment, EnvironmentLevelMap, ExecutionContext, GlobalLogOptions, LogLevel, LogOptions } from './base';

export interface TransportOptions {
  environmentLevelMap?: EnvironmentLevelMap;
  transportLogOptions?: GlobalLogOptions;
}

export interface ITransport {
  send: (level: LogLevel, message: string, options?: LogOptions) => void;
  setup: (executionContext: ExecutionContext, environment: Environment, globalLogOptions: GlobalLogOptions) => void;
}
