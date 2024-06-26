import type {
  CallbackData,
  Environment,
  ExecutionContext,
  GlobalLogOptions,
  ITransport,
  LogLevel,
  LogMetaInformation,
  LogOptions,
  LogTags,
  TransportOptions,
} from '../../types';
import { Colored, isRequiredEnvironment } from '../../constants';
import { deepmerge } from '../../util';

export class ConsoleTransport implements ITransport {
  private environment: Environment = 'production';

  private readonly environmentLevelMap: { [key in LogLevel]: Environment } = {
    fatal: 'production',
    error: 'production',
    warn: 'production',
    info: 'staging',
    debug: 'develop',
    trace: 'local',
  };

  private executionContext: ExecutionContext = 'browser';

  private transportLogOptions: GlobalLogOptions = {};

  public constructor(options?: TransportOptions) {
    if (options?.environmentLevelMap) {
      this.environmentLevelMap = { ...this.environmentLevelMap, ...options.environmentLevelMap };
    }
    if (options?.transportLogOptions) {
      this.transportLogOptions = options.transportLogOptions;
    }
  }

  public clone(): ConsoleTransport {
    return new ConsoleTransport({
      environmentLevelMap: deepmerge({}, this.environmentLevelMap),
      transportLogOptions: deepmerge({}, this.transportLogOptions),
    });
  }

  public send(level: LogLevel, message: string, options?: LogOptions): void {
    if (!isRequiredEnvironment(level, this.environmentLevelMap, this.environment)) {
      return;
    }

    const tagList = ConsoleTransport.getStringFromTags({ ...this.transportLogOptions.tags, ...options?.tags });
    const tags =
      tagList.length > 0 ? ` [${tagList.filter((value, index, self) => self.indexOf(value) === index).join('|')}]` : '';

    const log = `[${level.toUpperCase()}]${tags}: ${message}`;

    const color = Colored[this.executionContext][level];

    const meta: LogMetaInformation | undefined = deepmerge(this.transportLogOptions.meta, options?.meta);

    const messageParts: [unknown] = [color(log)];
    if (options?.objects) {
      messageParts.push(this.getLoggableObjects(options.objects));
    }
    if (options?.error) {
      messageParts.push(options.error);
    }

    switch (level) {
      case 'fatal':
        // eslint-disable-next-line no-console
        console.error(...messageParts);
        break;
      case 'error':
        // eslint-disable-next-line no-console
        console.error(...messageParts);
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(...messageParts);
        break;
      case 'info':
        // eslint-disable-next-line no-console
        console.info(...messageParts);
        break;
      case 'debug':
        // eslint-disable-next-line no-console
        console.debug(...messageParts);
        break;
      case 'trace':
        // eslint-disable-next-line no-console
        console.trace(...messageParts);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(...messageParts);
        break;
    }
    const callbackData: CallbackData = {
      level,
      message,
    };
    if (meta && Object.keys(meta).length > 0) {
      callbackData.meta = meta;
    }
    if (options?.error) {
      callbackData.error = options?.error;
    }
    if (options?.objects) {
      callbackData.objects = options.objects;
    }
    if (options?.callback) {
      options.callback(callbackData);
    } else if (this.transportLogOptions.callback) {
      this.transportLogOptions.callback(callbackData);
    }
  }

  public setup(executionContext: ExecutionContext, environment: Environment, globalLogOptions: GlobalLogOptions): void {
    this.environment = environment;
    this.executionContext = executionContext;
    this.transportLogOptions = deepmerge(globalLogOptions, this.transportLogOptions);
  }

  private static getStringFromTags(tags: LogTags): string[] {
    return Object.entries(tags).reduce((all, [key, value]) => {
      all.push(`${key}:${value}`);
      return all;
    }, [] as string[]);
  }

  private getLoggableObjects(objects: unknown | unknown[]): string | unknown | unknown[] {
    if (this.executionContext !== 'browser' && Object.prototype.toString.call(objects) !== '[object String]') {
      return JSON.stringify(objects);
    }

    return objects;
  }
}
