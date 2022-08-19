import { ConsoleTransport, LoggerFactory, LogLevel, LogOptions } from '@schablone/logging';
import { SentryBrowserTransport } from '@schablone/logging-transport-sentry-browser';

const logger = LoggerFactory({
  environment: 'local',
  transports: [
    new ConsoleTransport({
      transportLogOptions: {
        tags: ['ConsoleTransport'],
      },
    }),
    new SentryBrowserTransport({
      sentryConfig: {
        dsn: 'https://2403a222dc334e5a8a123e037b8e2a9e@o564898.ingest.sentry.io/6634249',
        initialScope: {
          user: { id: '12345', email: 'bob@test.de', username: 'BobTester' },
        },
      },
      transportLogOptions: {
        tags: ['SentryTransport'],
      },
    }),
  ],
});

export function App() {
  const handleClick = (level: LogLevel) => {
    const options: LogOptions = {
      meta: {
        name: 'Bob',
        job: 'Tester',
      },
      tags: ['handleClick'],
    };
    if (level === 'fatal' || level === 'error') {
      options.error = new Error(`A${level === 'error' ? 'n' : ''}${level === 'fatal' ? ' fatal' : ''} error`);
    }
    logger[level](`This is a ${level}`, options);
  };
  return (
    <>
      <button type="button" onClick={() => handleClick('trace')}>
        Trace
      </button>
      ;
      <button type="button" onClick={() => handleClick('debug')}>
        Debug
      </button>
      ;
      <button type="button" onClick={() => handleClick('info')}>
        Info
      </button>
      ;
      <button type="button" onClick={() => handleClick('warn')}>
        Warning
      </button>
      ;
      <button type="button" onClick={() => handleClick('error')}>
        Error
      </button>
      ;
      <button type="button" onClick={() => handleClick('fatal')}>
        Fatal
      </button>
      ;
    </>
  );
}

export default App;
