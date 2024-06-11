import type { Environment, ExecutionContext, GlobalLogOptions, SentryTransportOptions } from '@schablone/logging';
import { deepmerge, SentryTransport } from '@schablone/logging';
import * as SentryNode from '@sentry/node';
import type { NodeOptions } from '@sentry/node';

export class SentryNodeTransport extends SentryTransport {
  public constructor(options: SentryTransportOptions) {
    super(options);
  }

  public clone(): SentryNodeTransport {
    return new SentryNodeTransport({
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
    this.sentry = SentryNode;
    this.sentry.init(deepmerge({ environment: this.environment }, this.sentryConfig as NodeOptions));
    this.sentry.configureScope((scope) => {
      if (this.transportLogOptions.tags) {
        scope.setTags(this.transportLogOptions.tags);
      }
    });
  }
}
