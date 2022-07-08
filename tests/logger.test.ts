import { LogEntry, Logger } from 'winston';
import { WinstonLoggerFactory } from '../src';

describe('Winston Logger', () => {
    test('Simple log', async () => {
        const logger = WinstonLoggerFactory.createDefault({
            console: true
        });

        (logger as Logger).on('logged', (event: LogEntry) => {
            expect(event.level).toEqual('info');
        });

        logger.info('Test', {data: { prop: 'foo' }});
        logger.info('Test2', {data: { prop: 'bar' }});
    });
});