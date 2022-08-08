import { deepmerge } from 'deepmerge-ts';
import {
    Environment,
    ExecutionContext,
    GlobalLogOptions,
    ILogger,
    LoggerOptions,
    LogLevel,
    LogMetaInformation,
    LogOptions,
} from '../types';
import { Colored, EnvironmentWeight } from '../constants';

export class Logger implements ILogger {
    private readonly environment: Environment = 'production';

    private readonly environmentLevelMap: { [key in LogLevel]: Environment } = {
        fatal: 'production',
        error: 'production',
        warn: 'production',
        info: 'staging',
        debug: 'develop',
        trace: 'local',
    };

    private readonly executionContext: ExecutionContext = 'browser';

    private readonly globalLogOptions: GlobalLogOptions = {};

    public constructor(options?: LoggerOptions) {
        if (typeof window === 'undefined') {
            this.executionContext = 'node';
        }
        if (options?.environment) {
            this.environment = options.environment;
        }
        if (options?.environmentLevelMap) {
            this.environmentLevelMap = { ...this.environmentLevelMap, ...options.environmentLevelMap };
        }
        if (options?.globalLogOptions) {
            this.globalLogOptions = options.globalLogOptions;
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
        if (!this.isRequiredEnvironment(level)) {
            return;
        }

        let tagList: string[] = [];
        if (this.globalLogOptions.tags) {
            tagList = [...this.globalLogOptions.tags];
        }
        if (options?.tags) {
            tagList = [...tagList, ...options.tags];
        }
        const tags = tagList.length > 0 ? `[${tagList.join('|')}] ` : '';
        const log = `${tags}[${level.toUpperCase()}]: ${message}`;
        const color = Colored[this.executionContext][level];
        const meta: LogMetaInformation = {
            ...this.globalLogOptions.meta,
            ...options?.meta,
        };
        const messageParts: [unknown] = [color(log)];
        if (options?.objects) {
            messageParts.push(options.objects);
        }
        if (options?.error) {
            messageParts.push(options.error);
        }

        switch (level) {
            case 'fatal':
                console.error(...messageParts);
                break;
            case 'error':
                console.error(...messageParts);
                break;
            case 'warn':
                console.warn(...messageParts);
                break;
            case 'info':
                console.info(...messageParts);
                break;
            case 'debug':
                console.log(...messageParts);
                break;
            case 'trace':
                console.trace(...messageParts);
                break;
            default:
                console.log(...messageParts);
                break;
        }
        if (options?.callback) {
            options.callback(level, message, meta, options?.error);
        } else if (this.globalLogOptions.callback) {
            this.globalLogOptions.callback(level, message, meta, options?.error);
        }
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
            environmentLevelMap: options?.environmentLevelMap ?? this.environmentLevelMap,
            globalLogOptions: options?.globalLogOptions
                ? deepmerge(this.globalLogOptions, options?.globalLogOptions)
                : this.globalLogOptions,
        });
    }

    private isRequiredEnvironment(level: LogLevel) {
        return EnvironmentWeight[this.environmentLevelMap[level]] <= EnvironmentWeight[this.environment];
    }
}
