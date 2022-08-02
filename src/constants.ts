import { Environment } from './types';

export const EnvironmentWeight: Record<Environment, number> = {
    production: 0,
    staging: 10,
    develop: 20,
    local: 30,
};
