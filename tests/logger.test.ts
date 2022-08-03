import { Colored, ColorLevelMap, ILogger, LoggerFactory } from '../lib';

describe('Base Logger', () => {
    let logger: ILogger;
    let color: ColorLevelMap;

    beforeAll(() => {
        console.error = jest.fn();
        console.warn = jest.fn();
        console.info = jest.fn();
        console.log = jest.fn();
        console.trace = jest.fn();

        logger = LoggerFactory({
            environment: 'local',
        });

        color = Colored.node;
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
