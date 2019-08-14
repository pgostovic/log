import { createLogger } from './index.server';

const log = createLogger('Logger Demo');

log('This is a basic log statement');

log('Here is one with a few trailing args: ', { foo: 'bar' }, [1, 2, 3]);

log('Param subs -- object: %O, array: %O, string: %s, float: %f', { foo: 'bar' }, [1, 2, 3], 'Hello', 1.234567);

log.warn('This is a warning');

log.error('This is an error');

const fnOne = (): void => {
  log.error('Error with stack trace').stack();
  log.warn('Warn with stack trace').stack();
  log('Normal with stack trace').stack();
};

const fnTwo = (): void => {
  fnOne();
};

const fnThree = (): void => {
  fnTwo();
};

fnThree();
