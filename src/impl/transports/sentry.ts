import { deepmerge } from 'deepmerge-ts';
import type { EventHint, Scope } from '@sentry/types';
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
    SentrySdk,
    SentryTransportOptions,
} from '../../types';
import { isRequiredEnvironment, SentryLogMap } from '../../constants';

export class SentryTransport implements ITransport {
    private environment: Environment = 'production';

    private readonly environmentLevelMap: { [key in LogLevel]: Environment } = {
        fatal: 'production',
        error: 'production',
        warn: 'staging',
        info: 'never',
        debug: 'never',
        trace: 'never',
    };

    private executionContext: ExecutionContext = 'browser';

    private sentry!: SentrySdk;

    private readonly sentryConfig: SentryConfig;

    private transportLogOptions: GlobalLogOptions = {};

    public constructor(options: SentryTransportOptions) {
        this.sentryConfig = options.sentryConfig;
        if (options.environmentLevelMap) {
            this.environmentLevelMap = { ...this.environmentLevelMap, ...options.environmentLevelMap };
        }
        if (options.transportLogOptions) {
            this.transportLogOptions = options.transportLogOptions;
        }
    }

    public send(level: LogLevel, message: string, options?: LogOptions): void {
        if (!this.sentry || !isRequiredEnvironment(level, this.environmentLevelMap, this.environment)) {
            return;
        }

        const hint: EventHint = {};
        const meta: LogMetaInformation | undefined = deepmerge(this.transportLogOptions.meta, options?.meta);
        if (meta) {
            hint.data = meta;
        }
        if (options?.error) {
            hint.originalException = options.error as Error;
        }

        this.sentry.withScope((scope) => {
            scope.setLevel(SentryLogMap[level]);
            if (options?.tags) {
                SentryTransport.setTagsOnScope(options.tags, scope);
            }

            switch (level) {
                case 'fatal':
                    this.sentry.captureException(message, { data: meta });
                    break;
                case 'error':
                    this.sentry.captureException(message, { data: meta });
                    break;
                case 'warn':
                case 'info':
                case 'debug':
                case 'trace':
                    this.sentry.captureMessage(message, SentryLogMap[level], { data: meta });
                    break;
                default:
                    break;
            }
        });

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

    public setup(
        executionContext: ExecutionContext,
        environment: Environment,
        globalLogOptions: GlobalLogOptions
    ): void {
        this.environment = environment;
        this.executionContext = executionContext;
        console.log(this.executionContext);
        this.transportLogOptions = deepmerge(globalLogOptions, this.transportLogOptions);
        import(`@sentry/${this.executionContext}`).then((module) => {
            this.sentry = module;
            this.sentry.init(this.sentryConfig);
            this.sentry.configureScope((scope) => {
                if (this.transportLogOptions.tags) {
                    SentryTransport.setTagsOnScope(this.transportLogOptions.tags, scope);
                }
            });
        });
    }

    private static setTagsOnScope(tags: string[], scope: Scope): void {
        scope.setTags(
            tags.reduce((all: { [key: string]: boolean }, tag): { [key: string]: boolean } => {
                // eslint-disable-next-line no-param-reassign
                all[tag] = true;
                return all;
            }, {})
        );
    }
}
