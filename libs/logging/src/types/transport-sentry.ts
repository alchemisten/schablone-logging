import type { SeverityLevel } from '@sentry/types/types/severity';
import type { BrowserOptions } from '@sentry/browser';
import type { NodeOptions } from '@sentry/node';
import { LogLevel } from './base';
import { TransportOptions } from './transports';

export type SentryConfig = BrowserOptions | NodeOptions;

/**
 * Extend configuration options for the sentry transport
 */
export interface SentryTransportOptions extends TransportOptions {
  /**
   * A sentry options object, either BrowserOptions or NodeOptions, depending
   * on the execution context of the parent logger.
   */
  sentryConfig: SentryConfig;
}

/**
 * Maps the loggers levels to the severity levels used in sentry
 */
export type SentryLogLevelMap = {
  [key in LogLevel]: SeverityLevel;
};
