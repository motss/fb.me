// @ts-check

/** Import other modules */
import setDomainWhitelisting from '../set-domain-whitelisting';
import * as expected from './helper/expected';
import locky, { closeLocky } from './helper/locky';
import { testAppConfig } from './helper/test-config';

beforeEach(async () => {
  try {
    return await locky(testAppConfig);
  } catch (e) {
    throw e;
  }
});

afterAll(async () => {
  try {
    return await closeLocky();
  } catch (e) {
    throw e;
  }
});

describe('set-domain-whitelisting', async () => {
  test('Parameter url is invalid', async () => {
    try {
      await setDomainWhitelisting({
        url: null,
        domains: [
          '/haha',
        ],
        pageAccessToken: testAppConfig.pageAccessToken,
      });
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message)
        .toEqual('Parameter url is invalid');
    }
  });

  test('Parameter pageAccessToken is invalid', async () => {
    try {
      await setDomainWhitelisting({
        url: testAppConfig.url,
        domains: 'https://should-whiteliste.com',
        pageAccessToken: null,
      });
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message)
        .toEqual('Parameter pageAccessToken is invalid');
    }
  });

  test('Parameter domains has to be either a string or an array of strings', async () => {
    try {
      await setDomainWhitelisting({
        url: testAppConfig.url,
        domains: null,
        pageAccessToken: testAppConfig.pageAccessToken,
      });
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message)
        .toEqual('Parameter domains has to be either a string or an array of strings');
    }
  });

  test('whitelisted_domains[0] should represent a valid URL', async () => {
    try {
      await setDomainWhitelisting({
        url: testAppConfig.url,
        domains: [
          '/haha',
        ],
        pageAccessToken: testAppConfig.pageAccessToken,
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.domainWhitelisting.invalidURL });
    }
  });

  test('setDomainWhitelisting works for a domain string', async () => {
    try {
      const d = await setDomainWhitelisting({
        url: testAppConfig.url,
        domains: 'https://should-whitelist.com',
        pageAccessToken: testAppConfig.pageAccessToken,
      });

      expect(d).toEqual({ ...expected.domainWhitelisting.whitelistedSuccessfully });
    } catch (e) {
      throw e;
    }
  });

  test('setDomainWhitelisting works for an array of domain strings', async () => {
    try {
      const d = await setDomainWhitelisting({
        url: testAppConfig.url,
        domains: [
          'https://should-whitelist.com',
          'https://should-also-whitelist.com',
        ],
        pageAccessToken: testAppConfig.pageAccessToken,
      });

      expect(d).toEqual({ ...expected.domainWhitelisting.whitelistedSuccessfully });
    } catch (e) {
      throw e;
    }
  });

});
