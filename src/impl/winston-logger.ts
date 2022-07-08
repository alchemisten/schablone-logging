import { createLogger, format, LoggerOptions, transports } from 'winston';
import type { TransformableInfo } from 'logform';
import { ILogger } from '../types';

export interface WinstonLoggerProps {
    options?: Omit<LoggerOptions, 'format'>;
    console: boolean;
}

interface LogMessageProps extends TransformableInfo {
    timestamp?: string;
    ms?: string;
    data?: unknown;
}

export abstract class WinstonLoggerFactory {
    public static createDefault(props: WinstonLoggerProps): ILogger {
        const { options = {}, console } = props;

        const logger = createLogger({
            ...options,
            format: format.combine(format.timestamp({ format: 'DD.MM.YY HH:mm:ss' }), format.ms()),
        });

        if (console) {
            logger.add(
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.printf(({ level, message, timestamp, ms, data }: LogMessageProps) => {
                            const msg = [`[${level}] (${timestamp} Δ ${ms}):`, message];
                            if (data) {
                                const serializedData = JSON.stringify(data, null, '  ').split('\n').join('\n  ');
                                msg.push(`\n  ${serializedData}`);
                            }
                            return msg.filter((s) => !!s && s.trim().length > 0).join(' ');
                        })
                    ),
                })
            );
        }

        // TODO Sentry transport!!

        return logger;
    }
}
