import { createContext, FC, PropsWithChildren, useContext, useState, useMemo } from 'react';
import { ILogger, LoggerFactory, LoggerOptions } from '@schablone/logging';

const defaultLogger: ILogger = LoggerFactory({});

export interface LoggingContextType {
  logger: ILogger;
}

const defaultContext: LoggingContextType = {
  logger: defaultLogger;
}

export const LoggingContext = createContext<LoggingContextType | undefined>(undefined);

export const useLogger = (): LoggingContextType => {
  const loggerContext = useContext(LoggingContext);
  if(!loggerContext) {
    return defaultContext;
  }
  return loggerContext;
};

export interface LoggingProviderProps extends PropsWithChildren {
  logger?: ILogger;
  options: LoggerOptions;
}

export const LoggingProvider: FC<LoggingProviderProps> = ({ children, options, logger }) => {
  const parentContext = useContext(LoggingContext);
  
  const value = useMemo(() => {
    if(parentContext?.logger) {
      return {
        logger: parentContext.logger.withOptions(options);
      }
    }
    
    return defaultContext;
  }, [parentContext?.logger]);
  
  return <LoggingContext.Provider value={logger ?? value}>{children}</LoggingContext.Provider>;
};
