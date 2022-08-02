export interface LogEntry {
    level: string;
    message: string;
    [optionName: string]: unknown;
}

export type LogCallback = (error?: unknown, level?: string, message?: string, meta?: unknown) => void;

export type LogMetaInformation = Record<string, unknown>;

export interface LogOptions {
    callback?: LogCallback;
    meta?: LogMetaInformation;
    objects?: unknown | unknown[];
    tags?: string[];
}

export interface LogMethod {
    (level: string, message: string, options?: LogOptions): void;
}

export interface LeveledLogMethod {
    (message: string, options?: LogOptions): void;
}

/**
 * Reduced interface for exchange ability
 */
export interface ILogger {
    log: LogMethod;

    fatal: LeveledLogMethod;
    error: LeveledLogMethod;
    warn: LeveledLogMethod;
    info: LeveledLogMethod;
    debug: LeveledLogMethod;
    trace: LeveledLogMethod;
}
