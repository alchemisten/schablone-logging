import chalk from 'chalk';
import { Environment, ExecutionContextColorMap, LogLevel, SentryLogLevelMap } from './types';

export const EnvironmentWeight: Record<Environment, number> = {
  production: 0,
  staging: 10,
  develop: 20,
  local: 30,
  never: 100,
};

export const Colored: ExecutionContextColorMap = {
  // TODO: Colors not final
  node: {
    fatal: (message: string) => chalk.hex('#CC0000').inverse.bold(message),
    error: (message: string) => chalk.hex('#FF0000')(message),
    warn: (message: string) => chalk.hex('#CCCC00')(message),
    info: (message: string) => chalk.hex('#4646fa')(message),
    debug: (message: string) => chalk.hex('#00FF00')(message),
    trace: (message: string) => chalk.hex('#00FFFF')(message),
  },
  browser: {
    fatal: (message: string) => message,
    error: (message: string) => message,
    warn: (message: string) => message,
    info: (message: string) => message,
    debug: (message: string) => message,
    trace: (message: string) => message,
  },
};

export const SentryLogMap: SentryLogLevelMap = {
  fatal: 'fatal',
  error: 'error',
  warn: 'warning',
  info: 'info',
  debug: 'debug',
  trace: 'debug',
};

export const isRequiredEnvironment = (
  level: LogLevel,
  environmentLevelMap: { [key in LogLevel]: Environment },
  environment: Environment
): boolean => {
  return EnvironmentWeight[environmentLevelMap[level]] <= EnvironmentWeight[environment];
};
