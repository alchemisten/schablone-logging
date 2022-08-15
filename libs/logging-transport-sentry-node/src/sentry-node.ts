import {
  Environment,
  ExecutionContext,
  GlobalLogOptions,
  SentryTransport,
  SentryTransportOptions,
} from '@alchemisten/logging';
import * as SentryNode from '@sentry/node';
import { NodeOptions } from '@sentry/node';
import { deepmerge } from 'deepmerge-ts';

export class SentryNodeTransport extends SentryTransport {
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
    this.sentry = SentryNode;
    this.sentry.init(deepmerge({ environment: this.environment }, this.sentryConfig as NodeOptions));
    this.sentry.configureScope((scope) => {
      if (this.transportLogOptions.tags) {
        scope.setTags(SentryTransport.tagsArrayToRecord(this.transportLogOptions.tags));
      }
    });
  }
}
