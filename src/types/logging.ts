import type { SeverityLevel } from '@sentry/types/types/severity';
import type { Hub } from '@sentry/types';

export interface CallbackData {
    error?: unknown;
    level?: string;
    message?: string;
    meta?: unknown;
    objects?: unknown | unknown[];
}

export type LogCallback = (data: CallbackData) => void;

export type LogMetaInformation = Record<string, unknown>;

export interface LogOptions {
    callback?: LogCallback;
    meta?: LogMetaInformation;
    objects?: unknown | unknown[];
    tags?: string[];
    error?: unknown;
}

export type GlobalLogOptions = Pick<LogOptions, 'tags' | 'meta' | 'callback'>;

export interface LeveledLogMethod {
    (message: string, options?: LogOptions): void;
}

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type Environment = 'never' | 'local' | 'develop' | 'staging' | 'production';

export type EnvironmentLevelMap = {
    [key in LogLevel]?: Environment;
};

export interface LoggerOptions {
    environment?: Environment;
    globalLogOptions?: GlobalLogOptions;
    transports?: ITransport[];
}

export type ExecutionContext = 'node' | 'browser';

export type ColorLevelMap = {
    [key in LogLevel]: (message: string) => string;
};

export type ExecutionContextColorMap = {
    [key in ExecutionContext]: ColorLevelMap;
};

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

export interface TransportOptions {
    environmentLevelMap?: EnvironmentLevelMap;
    transportLogOptions?: GlobalLogOptions;
}

export interface SentryConfig {
    dsn: string;
    release?: string;
    tracesSampleRate?: number;
}

export interface SentryTransportOptions extends TransportOptions {
    sentryConfig: SentryConfig;
}

export interface ITransport {
    send: (level: LogLevel, message: string, options?: LogOptions) => void;
    setup: (executionContext: ExecutionContext, environment: Environment, globalLogOptions: GlobalLogOptions) => void;
}

export type SentryLogLevelMap = {
    [key in LogLevel]: SeverityLevel;
};

export type SentrySdk = Hub & {
    init: (sentryConfig: SentryConfig) => void;
};
