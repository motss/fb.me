// @ts-check

/** Import other modules */
import fetchAsJson from '../../helper/fetch-as-json';
import { testConfig } from '../test-config';
import locky, { closeLocky } from '../util/locky';

beforeEach(async () => {
  try {
    return await locky(testConfig);
  } catch (e) {
    await closeLocky();

    throw e;
  }
});

afterEach(async () => {
  try {
    return await closeLocky();
  } catch (e) {
    throw e;
  }
});

describe('helper', () => {
  describe('fetch-as-json', async () => {
    const {
      fbGraphUrl,
    } = testConfig;

    test('OK response', async () => {
      try {
        expect.assertions(2);

        const d = await fetchAsJson(`${fbGraphUrl}/fetchy?access_token=ok-fetchy`);

        expect(d.status).toEqual(200);
        expect(d).toEqual({
          status: expect.any(Number),
          data: {
            status: expect.any(Number),
            message: expect.stringMatching(/^ok/i),
          },
        });
      } catch (e) {
        throw e;
      }
    });

    test('Bad response', async () => {
      try {
        expect.assertions(2);

        const d = await fetchAsJson(`${fbGraphUrl}/fetchy?access_token=bad-fetchy`);

        expect(d.status).toBeGreaterThan(399);
        expect(d).toEqual({
          status: expect.any(Number),
          data: {
            status: expect.any(Number),
            message: expect.stringMatching(/^bad/i),
          },
        });
      } catch (e) {
        throw e;
      }
    });

    test('Fail request', async () => {
      try {
        expect.assertions(2);

        await fetchAsJson('/fail');
      } catch (e) {
        expect(e instanceof TypeError).toEqual(true);
        expect(e.message).toEqual('Only absolute URLs are supported');
      }
    });

  });
});
