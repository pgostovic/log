/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
// tslint:disable: no-console
import chalk from 'chalk';

const getTs = (): string => new Date().toISOString();

const colorize = (s: string, isBrowser: boolean): { args: string[]; text: string } => {
  const charCodeSum = s
    .split('')
    .map((char: string) => char.charCodeAt(0))
    .reduce((sum: number, charCode: number) => sum + charCode, 0);

  const hue = charCodeSum % 360;

  if (isBrowser) {
    return {
      args: [`font-weight: bold; color: hsl(${hue}, 100%, 30%)`, 'font-weight: normal; color: inherit'],
      text: `%c${s}%c`,
    };
  }
  return { args: [], text: chalk.hsl(hue, 100, 30).bold(s) };
};

let categoryMatcher: RegExp = process.env.NODE_ENV === 'test' ? /\.^/ : /.+/;

export const matchCategory = (matcher: RegExp): void => {
  categoryMatcher = matcher;
};

enum Method {
  Log = 'log',
  Error = 'error',
  Warn = 'warn',
  Group = 'group',
  GroupCollapsed = 'groupCollapsed',
}

interface LogFnResult {
  stack: () => void;
}

type LogFn = (...a: any[]) => LogFnResult;

export type Logger = LogFn & {
  error: LogFn;
  warn: LogFn;
};

const getPrefix = (method: Method): string => {
  switch (method) {
    case Method.Warn:
      return '⚠️  ';
    case Method.Error:
      return '🚫 ';
  }
  return '';
};

export const createLogger = (category: string, isBrowser: boolean): Logger => {
  const colorCat = colorize(category, isBrowser);

  const logFn = (method: Method, ...a: any[]): LogFnResult => {
    if (category.match(categoryMatcher)) {
      const [msg, ...args] = a;
      console[method](`${getTs()} ${colorCat.text} ${getPrefix(method)}${msg}`, ...colorCat.args, ...args);

      const stack = (): void => {
        const stackTrace = { stack: undefined };
        Error.captureStackTrace(stackTrace, stack);
        console.log(stackTrace.stack);
      };

      return { stack };
    }
    return { stack: (): void => {} };
  };

  const logger = (...a: any[]): LogFnResult => logFn(Method.Log, ...a);
  logger.error = (...a: any[]): LogFnResult => logFn(Method.Error, ...a);
  logger.warn = (...a: any[]): LogFnResult => logFn(Method.Warn, ...a);

  logger.group = (label: string, fn: (l: (...a: any[]) => void) => void) => {
    logFn(Method.Group, label);
    fn(logger);
    console.groupEnd();
  };

  logger.groupCollapsed = (label: string, fn: (l: (...a: any[]) => void) => void) => {
    logFn(Method.GroupCollapsed, label);
    fn(logger);
    console.groupEnd();
  };

  return logger;
};
