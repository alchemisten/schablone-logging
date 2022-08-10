import type SentryBrowser from '@sentry/browser';
import type SentryNode from '@sentry/node';
import { EventHint, Scope } from '@sentry/types';
import { deepmerge } from 'deepmerge-ts';
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
					this.sentry.captureException(message, { extra: meta });
					break;
				case 'error':
					this.sentry.captureException(message, { extra: meta });
					break;
				case 'warn':
				case 'info':
				case 'debug':
				case 'trace':
					this.sentry.captureMessage(message, SentryLogMap[level]); // TODO meta
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

	protected abstract setupImpl(
		executionContext: ExecutionContext,
		environment: Environment,
		globalLogOptions: GlobalLogOptions
	): void;

	public setup(executionContext: ExecutionContext, environment: Environment, globalLogOptions: GlobalLogOptions): void {
		this.setupImpl(executionContext, environment, globalLogOptions);
	}

	protected static setTagsOnScope(tags: string[], scope: Scope): void {
		scope.setTags(
			tags.reduce((all: { [key: string]: boolean }, tag): { [key: string]: boolean } => {
				// eslint-disable-next-line no-param-reassign
				all[tag] = true;
				return all;
			}, {})
		);
	}
}
