import { ILogger, LoggerFactory } from '../lib';

describe('Base Logger', () => {
    let logger: ILogger;

    beforeAll(() => {
        console.error = jest.fn();
        console.warn = jest.fn();
        console.info = jest.fn();
        console.log = jest.fn();
        console.trace = jest.fn();

        logger = LoggerFactory({
            environment: 'local',
        });
    });

    test('Fatal error', async () => {
        logger.fatal('A fatal error');
        expect(console.error).toHaveBeenCalledWith('[FATAL]: A fatal error');
    });

    test('Error', async () => {
        logger.error('An error');
        expect(console.error).toHaveBeenCalledWith('[ERROR]: An error');
    });

    test('Warning', async () => {
        logger.warn('A warning');
        expect(console.warn).toHaveBeenCalledWith('[WARN]: A warning');
    });

    test('Info', async () => {
        logger.info('An information');
        expect(console.info).toHaveBeenCalledWith('[INFO]: An information');
    });

    test('Debug', async () => {
        logger.debug('A debug message');
        expect(console.log).toHaveBeenCalledWith('[DEBUG]: A debug message');
    });

    test('Trace', async () => {
        logger.trace('A trace');
        expect(console.trace).toHaveBeenCalledWith('[TRACE]: A trace');
    });
});
