import type { SeverityLevel } from '@sentry/types/types/severity';
import type { BrowserOptions } from '@sentry/browser';
import type { NodeOptions } from '@sentry/node';
import { LogLevel } from './base';
import { TransportOptions } from './transports';

export type SentryConfig = BrowserOptions | NodeOptions;

export interface SentryTransportOptions extends TransportOptions {
  sentryConfig: SentryConfig;
}

export type SentryLogLevelMap = {
  [key in LogLevel]: SeverityLevel;
};
