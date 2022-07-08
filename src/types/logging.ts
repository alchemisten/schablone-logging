export interface LogEntry {
    level: string;
    message: string;
    [optionName: string]: unknown;
}

export type LogCallback = (error?: unknown, level?: string, message?: string, meta?: unknown) => void;

export interface LogMethod {
    (level: string, message: string, callback: LogCallback): ILogger;
    (level: string, message: string, meta: unknown, callback: LogCallback): ILogger;
    (level: string, message: string, ...meta: unknown[]): ILogger;
    (entry: LogEntry): ILogger;
    (level: string, message: unknown): ILogger;
}

export interface LeveledLogMethod {
    (message: string, callback: LogCallback): ILogger;
    (message: string, meta: unknown, callback: LogCallback): ILogger;
    (message: string, ...meta: unknown[]): ILogger;
    (message: unknown): ILogger;
    (infoObject: unknown): ILogger;
}

/**
 * Reduced interface for exchange ability
 */
export interface ILogger {
    child(options: unknown): ILogger;

    log: LogMethod;

    error: LeveledLogMethod;
    warn: LeveledLogMethod;
    info: LeveledLogMethod;
    http: LeveledLogMethod;
    debug: LeveledLogMethod;
    verbose: LeveledLogMethod;
    input: LeveledLogMethod;
}
