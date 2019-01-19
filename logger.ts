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
      args: [
        `font-weight: bold; color: hsl(${hue}, 100%, 30%)`,
        'font-weight: normal; color: inherit',
      ],
      text: `%c${s}%c`,
    };
  }
  return {
    args: [],
    text: chalk.hsl(hue, 100, 30).bold(s),
  };
};

export const createLogger = (category: string, isBrowser: boolean) => {
  const colorCat = colorize(category, isBrowser);
  const logFn = (...a: any[]) => {
    const [msg, ...args] = a;
    console.log(
      `${getTs()} ${colorCat.text} ${msg}`,
      ...colorCat.args,
      ...args,
    );
  };
  return logFn;
};
