import { ConsoleTransport, LoggerFactory, LoggerOptions, LogLevel, LogOptions } from '@schablone/logging';
import { SentryBrowserTransport } from '@schablone/logging-transport-sentry-browser';
import { environment } from '../environments/environment';

const options: LoggerOptions = {
  environment: 'local',
  transports: [
    new ConsoleTransport({
      transportLogOptions: {
        tags: ['ConsoleTransport'],
      },
    }),
  ],
};
if (environment.sentryDsn) {
  options.transports?.push(
    new SentryBrowserTransport({
      sentryConfig: {
        dsn: environment.sentryDsn,
        initialScope: {
          user: { id: '12345', email: 'bob@test.de', username: 'BobTester' },
        },
      },
      transportLogOptions: {
        tags: ['SentryTransport'],
      },
    })
  );
} else {
  console.warn('No NX_SENTRY_DSN configured, sentry transport not added', environment);
}

const logger = LoggerFactory(options);

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
