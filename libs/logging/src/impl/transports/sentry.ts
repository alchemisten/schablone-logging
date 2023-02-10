import type SentryBrowser from '@sentry/browser';
import type SentryNode from '@sentry/node';
import { ScopeContext } from '@sentry/types';
import { isRequiredEnvironment, SentryLogMap } from '../../constants';
import {
  CallbackData,
  Environment,
  ExecutionContext,
  GlobalLogOptions,
  ITransport,
  LogLevel,
  LogMetaInformation,
  LogOptions,
  SentryConfig,
  SentryTransportOptions,
} from '../../types';
import { deepmerge } from '../../util';

export abstract class SentryTransport implements ITransport {
  protected environment: Environment = 'production';

  protected readonly environmentLevelMap: { [key in LogLevel]: Environment } = {
    fatal: 'production',
    error: 'production',
    warn: 'staging',
    info: 'never',
    debug: 'never',
    trace: 'never',
  };

  protected executionContext: ExecutionContext = 'browser';

  protected sentry!: typeof SentryBrowser | typeof SentryNode;

  protected readonly sentryConfig: SentryConfig;

  protected transportLogOptions: GlobalLogOptions = {};

  protected constructor(options: SentryTransportOptions) {
    this.sentryConfig = options.sentryConfig;
    if (options.environmentLevelMap) {
      this.environmentLevelMap = { ...this.environmentLevelMap, ...options.environmentLevelMap };
    }
    if (options.transportLogOptions) {
      this.transportLogOptions = options.transportLogOptions;
    }
  }

  public abstract clone(): SentryTransport;

  public send(level: LogLevel, message: string, options?: LogOptions): void {
    if (!this.sentry || !isRequiredEnvironment(level, this.environmentLevelMap, this.environment)) {
      return;
    }

    const meta: LogMetaInformation | undefined = deepmerge(this.transportLogOptions.meta, options?.meta);
    const context: Partial<ScopeContext> = {
      extra: meta,
      level: SentryLogMap[level],
    };
    if (options?.tags) {
      context.tags = { ...this.transportLogOptions.tags, ...options.tags };
    } else {
      context.tags = this.transportLogOptions.tags;
    }

    switch (level) {
      case 'fatal':
      case 'error':
        this.sentry.captureException(options?.error ?? message, context);
        break;
      case 'warn':
      case 'info':
      case 'debug':
      case 'trace':
        this.sentry.captureMessage(message, context);
        break;
      default:
        break;
    }

    const callbackData: CallbackData = {
      level,
      message,
    };
    if (meta) {
      callbackData.meta = meta;
    }
    if (options?.error) {
      callbackData.error = options?.error;
    }
    if (options?.objects) {
      callbackData.objects = options.objects;
    }
    if (options?.callback) {
      options.callback(callbackData);
    } else if (this.transportLogOptions.callback) {
      this.transportLogOptions.callback(callbackData);
    }
  }

  protected abstract setupImpl(
    executionContext: ExecutionContext,
    environment: Environment,
    globalLogOptions: GlobalLogOptions
  ): void;

  public setup(executionContext: ExecutionContext, environment: Environment, globalLogOptions: GlobalLogOptions): void {
    this.setupImpl(executionContext, environment, globalLogOptions);
  }
}
