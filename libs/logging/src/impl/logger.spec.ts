import { Colored, ColorLevelMap, ILogger, LoggerFactory } from '../index';

describe('Base Logger', () => {
  let logger: ILogger;
  let color: ColorLevelMap;

  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
    console.log = jest.fn();
    console.trace = jest.fn();

    color = Colored.node;
  });

  beforeEach(() => {
    logger = LoggerFactory({
      environment: 'local',
    });
  });

  test('Fatal error', async () => {
    logger.fatal('A fatal error');
    expect(console.error).toHaveBeenCalledWith(color.fatal('[FATAL]: A fatal error'));
  });

  test('Error', async () => {
    logger.error('An error');
    expect(console.error).toHaveBeenCalledWith(color.error('[ERROR]: An error'));
  });

  test('Warning', async () => {
    logger.warn('A warning');
    expect(console.warn).toHaveBeenCalledWith(color.warn('[WARN]: A warning'));
  });

  test('Info', async () => {
    logger.info('An information');
    expect(console.info).toHaveBeenCalledWith(color.info('[INFO]: An information'));
  });

  test('Debug', async () => {
    logger.debug('A debug message');
    expect(console.log).toHaveBeenCalledWith(color.debug('[DEBUG]: A debug message'));
  });

  test('Trace', async () => {
    logger.trace('A trace');
    expect(console.trace).toHaveBeenCalledWith(color.trace('[TRACE]: A trace'));
  });
});

describe('Log options', () => {
  let logger: ILogger;
  let color: ColorLevelMap;

  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
    console.log = jest.fn();
    console.trace = jest.fn();

    color = Colored.node;
  });

  beforeEach(() => {
    logger = LoggerFactory({
      environment: 'local',
    });
  });

  test('Objects', async () => {
    const a = {
      name: 'Bob',
      id: 1234356,
    };
    const b = 'A string';
    logger.debug('Message', { objects: [a, b] });
    expect(console.log).toHaveBeenCalledWith(
      color.debug('[DEBUG]: Message'),
      '[{"name":"Bob","id":1234356},"A string"]'
    );
  });

  test('Error', async () => {
    const theError = new Error('Something went wrong');
    logger.error('An error', { error: theError });
    expect(console.error).toHaveBeenCalledWith(color.error('[ERROR]: An error'), theError);
  });

  test('Tags', async () => {
    const tags = {
      app: 'Test',
      test: 'Tags',
    };
    logger.debug('Message', { tags });
    expect(console.log).toHaveBeenCalledWith(color.debug('[DEBUG] [app:Test|test:Tags]: Message'));
  });

  test('Meta', async () => {
    const meta = {
      user: 'Bob',
      id: '',
    };
    logger.debug('Message', { meta });
    expect(console.log).toHaveBeenCalledWith(color.debug('[DEBUG]: Message'));
  });

  test('Callback', async () => {
    const callback = jest.fn();
    logger.debug('Message', { callback });
    expect(console.log).toHaveBeenCalledWith(color.debug('[DEBUG]: Message'));
    expect(callback).toHaveBeenCalledWith({ level: 'debug', message: 'Message' });
  });

  test('Callback with data', async () => {
    const a = {
      name: 'Bob',
      id: 1234356,
    };
    const b = 'A string';
    const theError = new Error('Something went wrong');
    const tags = {
      app: 'Test',
      test: 'Tags',
    };
    const meta = {
      user: 'Bob',
      id: '',
    };
    const callback = jest.fn();
    logger.error('An error', { objects: [a, b], meta, error: theError, tags, callback });
    expect(console.error).toHaveBeenCalledWith(
      color.error('[ERROR] [app:Test|test:Tags]: An error'),
      '[{"name":"Bob","id":1234356},"A string"]',
      theError
    );
    expect(callback).toHaveBeenCalledWith({
      level: 'error',
      message: 'An error',
      meta,
      objects: [a, b],
      error: theError,
    });
  });
});
