export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type Environment = 'never' | 'local' | 'develop' | 'staging' | 'production';

export type EnvironmentLevelMap = {
  [key in LogLevel]?: Environment;
};

export type ExecutionContext = 'node' | 'browser';

export type ColorLevelMap = {
  [key in LogLevel]: (message: string) => string;
};

export type ExecutionContextColorMap = {
  [key in ExecutionContext]: ColorLevelMap;
};

export interface CallbackData {
  error?: unknown;
  level: string;
  message: string;
  meta?: unknown;
  objects?: unknown | unknown[];
}

export type LogCallback = (data: CallbackData) => void;

export type LogMetaInformation = Record<string, unknown>;

export interface LogOptions {
  callback?: LogCallback;
  meta?: LogMetaInformation;
  objects?: unknown | unknown[];
  tags?: string[];
  error?: unknown;
}

export type GlobalLogOptions = Pick<LogOptions, 'tags' | 'meta' | 'callback'>;
