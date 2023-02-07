import { ConsoleTransport, LoggerOptions, LogLevel, LogOptions } from '@schablone/logging';
import { SentryBrowserTransport } from '@schablone/logging-transport-sentry-browser';
import { environment } from '../environments/environment';
import { LoggingProvider, useLogger } from '@schablone/logging-react';

const mainLoggerOptions: LoggerOptions = {
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
  mainLoggerOptions.transports?.push(
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
  const lowerLevelOptions: LoggerOptions = {
    globalLogOptions: {
      tags: {
        level: 'lower',
      },
    },
  };

  const handleClick = (level: LogLevel) => {
    const logClickOptions: LogOptions = {
      meta: {
        name: 'Bob',
        job: 'Tester',
      },
      tags: { function: 'handleClick' },
    };
    if (level === 'fatal' || level === 'error') {
      logClickOptions.error = new Error(`A${level === 'error' ? 'n' : ''}${level === 'fatal' ? ' fatal' : ''} error`);
    }
    logger[level](`This is a ${level}`, logClickOptions);
  };

  return (
    <>
      <h2>Inside the App</h2>
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
        <LoggingProvider options={lowerLevelOptions}>
          <LowerLevelWithOwnLogger />
        </LoggingProvider>
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
  const handleClick = () => {
    logger.warn('Warning from the lower level with custom provider');
  };

  return (
    <button type="button" onClick={handleClick}>
      Warn Lower
    </button>
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
  const { logger } = useLogger();
  const handleClick = () => {
    logger.warn('Logging without a provider');
  };

  return (
    <div>
      <div>
        <h2>Outer most layer</h2>
        <button type="button" onClick={handleClick}>
          Warn without provider
        </button>
      </div>

      <LoggingProvider options={mainLoggerOptions}>
        <App />
      </LoggingProvider>
    </div>
  );
};

export default AppRoot;
