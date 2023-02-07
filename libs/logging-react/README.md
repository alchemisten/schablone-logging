# logging-react

Contains React specific implementation helpers for the logger.

## Usage
The most common use case is to pass the logger options directly to the provider:
```typescript jsx
import { LoggingProvider } from '@schablone/logging-react';
import { useEffect } from 'react';

const options = {
    environment: 'local',
  };

const AppRoot = () => {
  return (
    <LoggingProvider options={options}>
      <App />
    </LoggingProvider>
  );
};

const App = () => {
  const { logger } = useLogger();
  
  useEffect(() => {
    logger.debug('Getting started!');
  }, [logger]);
  
  return (
    <h1>Hello World</h1>
  );
};
```

### Default usage without provider
The logger can also be used without a provider higher in the tree. It will then
use the default logger without any additional configuration.

### Nested provider
If multiple LoggingProvider are nested the lower level provider will
instantiate a derived logger from the parent provider via the withOptions()
function of the logger if only options are provided.

```typescript jsx
import { LoggingProvider } from '@schablone/logging-react';

const App = () => {
  return (
    <LoggingProvider options={mainOptions}>
      <ComponentOne>
        <LoggingProvider options{lowerLevelOptions}>
          <ComponentTwo />
        </LoggingProvider>
      </ComponentOne>
    </LoggingProvider>
  );
};
```

### Force logger usage
Instead of passing the options to the provider, a logger instance can also be
passed directly to the provider. This might be useful if other parts of the
application which do not use React also need access to the logger.

A nested provider can also use this feature to prevent deriving its logger from
the parent context.

```typescript jsx
import { LoggerFactory } from '@schablone/logging';
import { LoggingProvider } from '@schablone/logging-react';

const App = () => {
  const logger = LoggerFactory({
    environment: 'development',
  });

  return (
    <LoggingProvider logger={logger}>
      <Component/>
    </LoggingProvider>
  );
};
```
