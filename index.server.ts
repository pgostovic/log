import { createLogger as loggerCreate } from './logger';

export const createLogger = (category: string) => loggerCreate(category, false);
