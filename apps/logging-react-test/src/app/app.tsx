import { ConsoleTransport, LoggerFactory, LogLevel, LogOptions } from '@alchemisten/logging';
import { SentryBrowserTransport } from '@alchemisten/logging-transport-sentry-browser';

const logger = LoggerFactory({
  environment: 'local',
  transports: [
    new ConsoleTransport({}),
    new SentryBrowserTransport({
      sentryConfig: {
        dsn: 'https://2403a222dc334e5a8a123e037b8e2a9e@o564898.ingest.sentry.io/6634249',
      },
    }),
  ],
});

export function App() {
  const handleClick = (level: LogLevel) => {
    const options: LogOptions = {};
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
