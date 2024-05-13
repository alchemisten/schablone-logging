import type { Environment, ExecutionContext, GlobalLogOptions, SentryTransportOptions } from '@schablone/logging';
import { deepmerge, SentryTransport } from '@schablone/logging';
import * as SentryBrowser from '@sentry/browser';
import type { BrowserOptions } from '@sentry/browser';

export class SentryBrowserTransport extends SentryTransport {
  public constructor(options: SentryTransportOptions) {
    super(options);
  }

  public clone(): SentryBrowserTransport {
    return new SentryBrowserTransport({
      sentryConfig: deepmerge({}, this.sentryConfig),
      environmentLevelMap: deepmerge({}, this.environmentLevelMap),
      transportLogOptions: deepmerge({}, this.transportLogOptions),
    });
  }

  protected setupImpl(
    executionContext: ExecutionContext,
    environment: Environment,
    globalLogOptions: GlobalLogOptions,
  ): void {
    this.environment = environment;
    this.executionContext = executionContext;
    this.transportLogOptions = deepmerge(globalLogOptions, this.transportLogOptions);
    this.sentry = SentryBrowser;
    this.sentry.init(deepmerge({ environment: this.environment }, this.sentryConfig as BrowserOptions));
  }
}
