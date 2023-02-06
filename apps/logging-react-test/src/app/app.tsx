import { ConsoleTransport, LoggerOptions, LogLevel, LogOptions } from '@schablone/logging';
import { SentryBrowserTransport } from '@schablone/logging-transport-sentry-browser';
import { environment } from '../environments/environment';
import { LoggingProvider, useLogger } from '@schablone/logging-react';

const options: LoggerOptions = {
  environment: 'local',
  globalLogOptions: {
    tags: {
      app: 'LoggerTest',
    },
  },
  transports: [
    new ConsoleTransport({
      transportLogOptions: {
        tags: { transport: 'ConsoleTransport' },
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
        tags: { transport: 'SentryTransport' },
      },
    })
  );
} else {
  console.warn('No NX_SENTRY_DSN configured, sentry transport not added', environment);
}

export function App() {
  const { logger } = useLogger();

  const handleClick = (level: LogLevel) => {
    const options: LogOptions = {
      meta: {
        name: 'Bob',
        job: 'Tester',
      },
      tags: { function: 'handleClick' },
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
      <button type="button" onClick={() => handleClick('debug')}>
        Debug
      </button>
      <button type="button" onClick={() => handleClick('info')}>
        Info
      </button>
      <button type="button" onClick={() => handleClick('warn')}>
        Warning
      </button>
      <button type="button" onClick={() => handleClick('error')}>
        Error
      </button>
      <button type="button" onClick={() => handleClick('fatal')}>
        Fatal
      </button>

      <div>
        <h2>Lower level with own logger</h2>
        <LowerLevelWithOwnLogger />
      </div>

      <div>
        <h2>Lower level with parent logger</h2>
        <LowerLevelWithParentLogger />
      </div>
    </>
  );
}

const LowerLevelWithOwnLogger = () => {
  const { logger } = useLogger();
  const options: LoggerOptions = {
    globalLogOptions: {
      tags: {
        level: 'lower',
      },
    },
  };
  const handleClick = () => {
    logger.warn('Warning from the lower level with custom provider');
  };

  return (
    <LoggingProvider options={options}>
      <button type="button" onClick={handleClick}>
        Warn Lower
      </button>
    </LoggingProvider>
  );
};

const LowerLevelWithParentLogger = () => {
  const { logger } = useLogger();
  const handleClick = () => {
    logger.warn('Warning from the lower level with parent logger');
  };

  return (
    <button type="button" onClick={handleClick}>
      Warn Lower
    </button>
  );
};

const AppRoot = () => {
  return (
    <LoggingProvider options={options}>
      <App />
    </LoggingProvider>
  );
};

export default AppRoot;
