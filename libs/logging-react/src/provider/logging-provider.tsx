import { createContext, FC, PropsWithChildren, useContext, useState } from 'react';
import { ILogger, LoggerFactory, LoggerOptions } from '@schablone/logging';

export interface LoggingContextType {
  logger: ILogger;
  replaceLogger: (options: LoggerOptions) => void;
}

export const LoggingContext = createContext<LoggingContextType | undefined>(undefined);

const useCreateLoggingInfo = (options: LoggerOptions): LoggingContextType => {
  const [logger, setLogger] = useState<ILogger>(LoggerFactory(options));
  const replaceLogger = (options: LoggerOptions) => {
    setLogger(LoggerFactory(options));
  };

  return {
    logger,
    replaceLogger,
  };
};

export const useLogger = (): LoggingContextType => {
  const context = useContext(LoggingContext);
  if (context === undefined) {
    throw new Error('useLogger must be used within a LoggingProvider');
  }
  return context;
};

interface LoggingProviderProps extends PropsWithChildren {
  options: LoggerOptions;
}

export const LoggingProvider: FC<LoggingProviderProps> = ({ children, options }) => {
  const value = useCreateLoggingInfo(options);
  return <LoggingContext.Provider value={value}>{children}</LoggingContext.Provider>;
};
