import { createLogger as loggerCreate, LogFn } from './logger';

export const createLogger = (category: string): LogFn => loggerCreate(category, false);
