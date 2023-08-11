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
  stack: (err?: unknown) => void;
}

type LogFn = (...a: any[]) => LogFnResult;

export type Logger = LogFn & {
  error: LogFn;
  warn: LogFn;
  group(...a: any[]): void;
  groupCollapsed(...a: any[]): void;
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

class StackTrace {
  public stack = '';

  constructor(context: Error | (() => void)) {
    if (context instanceof Error) {
      this.stack = context.stack || '';
    } else {
      Error.captureStackTrace(this, context);
    }
    this.stack = this.stack
      .split('\n')
      .slice(1)
      .join('\n');
  }
}

export const createLogger = (category: string, isBrowser: boolean): Logger => {
  const colorCat = colorize(category, isBrowser);

  const logFn = (method: Method, ...a: any[]): LogFnResult => {
    if (category.match(categoryMatcher)) {
      const [msg, ...args] = a;
      console[method](`${getTs()} ${colorCat.text} ${getPrefix(method)}${msg}`, ...colorCat.args, ...args);

      const stack = (err?: unknown): void => {
        const stackTrace = new StackTrace(err instanceof Error ? err : stack);
        if (isBrowser) {
          console.log(`%c${stackTrace.stack}`, 'color: #999');
        } else {
          console.log(chalk.hsl(0, 0, 30)(stackTrace.stack));
        }
      };

      return { stack };
    }
    return {
      stack: (): void => {
        // do nothing
      },
    };
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
