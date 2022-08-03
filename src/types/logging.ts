import { Instance } from 'chalk';

export type LogCallback = (level?: string, message?: string, meta?: unknown, error?: unknown) => void;

export type LogMetaInformation = Record<string, unknown>;

export interface LogOptions {
    callback?: LogCallback;
    meta?: LogMetaInformation;
    objects?: unknown | unknown[];
    tags?: string[];
    error?: unknown;
}

export interface LogMethod {
    (level: LogLevel, message: string, options?: LogOptions): void;
}

export interface LeveledLogMethod {
    (message: string, options?: LogOptions): void;
}

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type Environment = 'local' | 'develop' | 'staging' | 'production';

export type EnvironmentLevelMap = {
    [key in LogLevel]?: Environment;
};

export interface LoggerOptions {
    environment?: Environment;
    environmentLevelMap?: EnvironmentLevelMap;
}

export type ExecutionContext = 'node' | 'browser';

export type ColorLevelMap = {
    [key in LogLevel]: (message: string) => string | Instance;
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
    withOptions(options: Pick<LogOptions, 'tags' | 'meta' | 'callback'>): ILogger;
}
