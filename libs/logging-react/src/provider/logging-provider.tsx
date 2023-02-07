import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { ILogger, LoggerFactory, LoggerOptions } from '@schablone/logging';

const defaultLogger: ILogger = LoggerFactory({});

export interface LoggingContextType {
  logger: ILogger;
}

const defaultContext: LoggingContextType = {
  logger: defaultLogger,
};

export const LoggingContext = createContext<LoggingContextType>(defaultContext);

export const useLogger = (): LoggingContextType => {
  return useContext(LoggingContext);
};

export interface LoggingProviderProps extends PropsWithChildren {
  logger?: ILogger;
  options: LoggerOptions;
}

export const LoggingProvider: FC<LoggingProviderProps> = ({ children, options, logger }) => {
  const parentContext = useContext(LoggingContext);

  const value = useMemo(() => {
    if (logger) {
      return {
        logger,
      };
    }

    if (parentContext?.logger) {
      return {
        logger: parentContext.logger.withOptions(options),
      };
    }

    return defaultContext;
  }, [logger, options, parentContext?.logger]);

  return <LoggingContext.Provider value={value}>{children}</LoggingContext.Provider>;
};
