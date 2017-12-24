// @ts-check

/** Import project dependencies */
import test from 'ava';

/** Import other modules */
import greeting, { greetingSync } from '../';

test('greeting works', async (t) => {
  try {
    const d = await greeting('John Doe');

    t.is(d, 'Hello, John Doe!');
  } catch (e) {
    t.fail(e);
  }
});

test('greetingSync works', async (t) => {
  try {
    const d = greetingSync('John Doe');

    t.is(d, 'Hello, John Doe!');
  } catch (e) {
    t.fail(e);
  }
});
