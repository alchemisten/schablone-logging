import { Environment, ILogger, LoggerOptions, LogLevel, LogOptions } from '../types';
import { EnvironmentWeight } from '../constants';

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

    public constructor(options?: LoggerOptions) {
        if (options?.environment) {
            this.environment = options.environment;
        }
        if (options?.environmentLevelMap) {
            this.environmentLevelMap = { ...this.environmentLevelMap, ...options.environmentLevelMap };
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

        const tags = options?.tags ? `[${options?.tags?.join('|')}] ` : '';
        const log = `${tags}[${level.toUpperCase()}]: ${message}`;

        switch (level) {
            case 'fatal':
                console.error(log, options?.objects);
                break;
            case 'error':
                console.error(log, options?.objects);
                break;
            case 'warn':
                console.warn(log, options?.objects);
                break;
            case 'info':
                console.info(log, options?.objects);
                break;
            case 'debug':
                console.debug(log, options?.objects);
                break;
            case 'trace':
                console.trace(log, options?.objects);
                break;
            default:
                console.log(log, options?.objects);
                break;
        }
        if (options?.callback) {
            options.callback(level, message, options?.meta, options?.error);
        }
    }

    public trace(message: string, options?: LogOptions): void {
        this.log('trace', message, options);
    }

    public warn(message: string, options?: LogOptions): void {
        this.log('warn', message, options);
    }

    private isRequiredEnvironment(level: LogLevel) {
        return EnvironmentWeight[this.environmentLevelMap[level]] <= EnvironmentWeight[this.environment];
    }
}
