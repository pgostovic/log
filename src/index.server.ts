import { createLogger as loggerCreate, Logger, matchCategory as matchCat } from './logger';

export const matchCategory = matchCat;

export const createLogger = (category: string): Logger => loggerCreate(category, false);
