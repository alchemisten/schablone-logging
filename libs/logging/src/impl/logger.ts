import type {
  Environment,
  ExecutionContext,
  GlobalLogOptions,
  ILogger,
  ITransport,
  LoggerOptions,
  LogLevel,
  LogOptions,
} from '../types';
import { ConsoleTransport } from './transports';
import { deepmerge } from '../util';

export class Logger implements ILogger {
  private readonly environment: Environment = 'production';

  private readonly executionContext: ExecutionContext = 'browser';

  private readonly globalLogOptions: GlobalLogOptions = {};

  private readonly transports: ITransport[] = [];

  public constructor(options?: LoggerOptions) {
    if (typeof window === 'undefined') {
      this.executionContext = 'node';
    }
    if (options?.environment) {
      this.environment = options.environment;
    }
    if (options?.globalLogOptions) {
      this.globalLogOptions = options.globalLogOptions;
    }
    if (options?.transports && options.transports.length > 0) {
      options.transports.forEach((transport) => {
        transport.setup(this.executionContext, this.environment, this.globalLogOptions);
        this.transports.push(transport);
      });
    } else {
      const defaultTransport = new ConsoleTransport();
      defaultTransport.setup(this.executionContext, this.environment, this.globalLogOptions);
      this.transports.push(defaultTransport);
    }
  }

  public debug(message: string, options?: LogOptions): void {
    this.log('debug', message, options);
  }

  public error(message: string, options?: LogOptions): void {
    this.log('error', message, options);
  }

  public fatal(message: string, options?: LogOptions): void {
    this.log('fatal', message, options);
  }

  public info(message: string, options?: LogOptions): void {
    this.log('info', message, options);
  }

  private log(level: LogLevel, message: string, options?: LogOptions): void {
    this.transports.forEach((transport) => {
      transport.send(level, message, options);
    });
  }

  public trace(message: string, options?: LogOptions): void {
    this.log('trace', message, options);
  }

  public warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options);
  }

  public withOptions(options: LoggerOptions): ILogger {
    return new Logger({
      environment: options?.environment ?? this.environment,
      globalLogOptions: options?.globalLogOptions
        ? deepmerge({}, this.globalLogOptions, options?.globalLogOptions)
        : deepmerge({}, this.globalLogOptions),
      transports:
        options.transports ??
        this.transports.reduce((acc: ITransport[], transport) => {
          acc.push(transport.clone());
          return acc;
        }, []),
    });
  }
}
