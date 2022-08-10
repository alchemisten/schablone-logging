import {
  Environment,
  ExecutionContext,
  GlobalLogOptions,
  SentryTransport,
  SentryTransportOptions,
} from '@alchemisten/logging';
import * as SentryBrowser from '@sentry/browser';
import { deepmerge } from 'deepmerge-ts';

export class SentryBrowserTransport extends SentryTransport {
  public constructor(options: SentryTransportOptions) {
    super(options);
  }

  protected setupImpl(
    executionContext: ExecutionContext,
    environment: Environment,
    globalLogOptions: GlobalLogOptions
  ): void {
    this.environment = environment;
    this.executionContext = executionContext;
    this.transportLogOptions = deepmerge(globalLogOptions, this.transportLogOptions);
    this.sentry = SentryBrowser;
    this.sentry.init(this.sentryConfig);
    this.sentry.configureScope((scope) => {
      if (this.transportLogOptions.tags) {
        SentryTransport.setTagsOnScope(this.transportLogOptions.tags, scope);
      }
    });
  }
}
