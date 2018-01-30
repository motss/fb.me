// @ts-check

/** Import other modules */
import setMessengerCode from '../set-messenger-code';
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

describe('set-messenger-code', () => {
  test('Parameter url is invalid', async () => {
    try {
      await setMessengerCode({
        url: null,
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
      await setMessengerCode({
        url: testAppConfig.url,
        pageAccessToken: null,
      });
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toEqual('Parameter pageAccessToken is invalid');
    }
  });

  test('Param image_size must be a number less than or equal to 2000', async () => {
    try {
      await setMessengerCode({
        url: testAppConfig.url,
        pageAccessToken: testAppConfig.pageAccessToken,
        ref: 'abc+=/',
        imageSize: 9999,
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.messengerCode.invalidImageSize });
    }
  });

  test('An unknown error has occurred', async () => {
    try {
      await setMessengerCode({
        url: testAppConfig.url,
        pageAccessToken: testAppConfig.pageAccessToken,
        ref: 'abc+=*',
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.messengerCode.unknownError });
    }
  });

  test('setMessengerCode works', async () => {
    try {
      const d = await setMessengerCode({
        url: testAppConfig.url,
        pageAccessToken: testAppConfig.pageAccessToken,
      });

      expect(d).toEqual({ ...expected.messengerCode.codedSuccessfully });
    } catch (e) {
      throw e;
    }
  });

  test('setMessengerCode works with ref + imageSize', async () => {
    try {
      const d = await setMessengerCode({
        url: testAppConfig.url,
        pageAccessToken: testAppConfig.pageAccessToken,
        ref: 'abc+=/',
        imageSize: 1999,
      });

      expect(d).toEqual({ ...expected.messengerCode.codedSuccessfully });
    } catch (e) {
      throw e;
    }
  });

});
