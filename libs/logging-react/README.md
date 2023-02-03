# logging-react

Contains React specific implementation helpers for the logger.

## Usage

```typescript jsx
import { LoggingProvider } from '@schablone/logging-react';
import { useEffect } from 'react';

const options = {
    environment: 'local',
  };

const AppRoot = () => {
  return (
    <LoggingProvider value={options}>
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
