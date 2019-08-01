// tslint:disable: no-console
import chalk from 'chalk';

const getTs = () => new Date().toISOString();

const colorize = (s: string, isBrowser: boolean) => {
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
  Group = 'group',
  GroupCollapsed = 'groupCollapsed',
}

export const createLogger = (category: string, isBrowser: boolean) => {
  const colorCat = colorize(category, isBrowser);
  const logFn = (method: Method, ...a: any[]) => {
    if (category.match(categoryMatcher)) {
      const [msg, ...args] = a;
      console[method](`${getTs()} ${colorCat.text} ${msg}`, ...colorCat.args, ...args);
    }
  };

  const logger = (...a: any[]) => logFn(Method.Log, ...a);

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
