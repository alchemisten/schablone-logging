import {
  deepmerge,
  Environment,
  ExecutionContext,
  GlobalLogOptions,
  SentryTransport,
  SentryTransportOptions,
} from '@schablone/logging';
import * as SentryBrowser from '@sentry/browser';
import { BrowserOptions } from '@sentry/browser';

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
    this.sentry.init(deepmerge({ environment: this.environment }, this.sentryConfig as BrowserOptions));
    this.sentry.configureScope((scope) => {
      if (this.transportLogOptions.tags) {
        scope.setTags(SentryTransport.tagsArrayToRecord(this.transportLogOptions.tags));
      }
    });
  }
}
