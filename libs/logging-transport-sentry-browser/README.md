# logging-transport-sentry-browser
This is the browser implementation of the SentryTransport. Use this if you
want to log Sentry from a browser.

## Usage

```typescript
import LoggerFactory from '@alchemisten/logging';
import { SentryBrowserTransport } from '@alchemisten/logging-transport-sentry-browser';

const logger = LoggerFactory({
  transports: [
    new SentryBrowserTransport({
      sentryConfig: {
        dsn: 'a-sentry-server-dsn',
        initialScope: {
          user: { id: '12345', email: 'bob@test.de', username: 'BobTester' },
        },
      },
      transportLogOptions: {
        meta: {
          information: 'Something to note'
        },
        tags: ['SentryTag'],
      },
    }),
  ],
  globalLogOptions: {
    callback: (data) => {
      const { error, level, message, meta, objects } = data;
      // Use data in some way
    },
    meta: {
      name: 'Bob',
      job: 'Tester',
    },
    tags: ['GlobalTag'],
  },
});
logger.debug("This is a debug message");
```
