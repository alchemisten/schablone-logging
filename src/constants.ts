import chalk from 'chalk';
import { Environment, ExecutionContextColorMap } from './types';

export const EnvironmentWeight: Record<Environment, number> = {
    production: 0,
    staging: 10,
    develop: 20,
    local: 30,
};

export const Colored: ExecutionContextColorMap = {
    // TODO: Colors not final
    node: {
        fatal: (message: string) => chalk.hex('#CC0000').inverse.bold(message),
        error: (message: string) => chalk.hex('#FF0000')(message),
        warn: (message: string) => chalk.hex('#CCCC00')(message),
        info: (message: string) => chalk.hex('#0000FF')(message),
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
