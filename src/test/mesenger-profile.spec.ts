// @ts-check

/** Import other modules */
import {
  deleteMessengerProfile,
  getMessengerProfile,
  setMessengerProfile,
} from '../messenger-profile';
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

describe('messenger-profile', () => {
  describe('delete', () => {
    test('Parameter url is invalid', async () => {
      try {
        await deleteMessengerProfile({
          url: null,
          pageAccessToken: testAppConfig.pageAccessToken,
          fields: null,
        });
      } catch (e) {
        expect(e instanceof TypeError).toBe(true);
        expect(e.message)
        .toEqual('Parameter url is invalid');
      }
    });

    test('Parameter pageAccessToken is invalid', async () => {
      try {
        await deleteMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: null,
          fields: null,
        });
      } catch (e) {
        expect(e instanceof TypeError).toBe(true);
        expect(e.message).toEqual('Parameter pageAccessToken is invalid');
      }
    });

    test('The parameter fields is required', async () => {
      try {
        await deleteMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          fields: null,
        });
      } catch (e) {
        expect(e).toEqual({
          ...expected.messengerProfile.delete.missingFields,
        });
      }
    });

    test('param fields must be non-empty', async () => {
      try {
        await deleteMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          fields: [],
        });
      } catch (e) {
        expect(e).toEqual({
          ...expected.messengerProfile.delete.emptyFields,
        });
      }
    });

    test('Param fields[0] must be one of ...', async () => {
      try {
        await deleteMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          fields: [
            'getting_started',
          ],
        });
      } catch (e) {
        expect(e).toEqual({
          ...expected.messengerProfile.delete.fieldsMustBeOneOf,
        });
      }
    });

    test('deleteMessengerProfile works', async () => {
      try {
        const d = await deleteMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          fields: [
            'get_started',
          ],
        });

        expect(d).toEqual({
          ...expected.messengerProfile.delete.deletedSuccessfully,
        });
      } catch (e) {
        throw e;
      }
    });

  });

  describe('get', () => {
    test('Parameter url is invalid', async () => {
      try {
        await getMessengerProfile({
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
        await getMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: null,
        });
      } catch (e) {
        expect(e instanceof TypeError).toBe(true);
        expect(e.message).toEqual('Parameter pageAccessToken is invalid');
      }
    });

    test('Syntax error \"Expected name.\" at character 0: *****', async () => {
      try {
        await getMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          fields: '******',
        });
      } catch (e) {
        expect(e).toEqual({
          ...expected.messengerProfile.get.syntaxError,
        });
      }
    });

    test('getMessengerProfile works (fields == null)', async () => {
      try {
        const d = await getMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
        });

        expect(d).toEqual({
          ...expected.messengerProfile.get.getSuccessfully,
        });
      } catch (e) {
        throw e;
      }
    });

    test('getMessengerProfile works (fields === \'\')', async () => {
      try {
        const d = await getMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          fields: '',
        });

        expect(d).toEqual({
          ...expected.messengerProfile.get.getSuccessfully,
        });
      } catch (e) {
        throw e;
      }
    });

    test('getMessengerProfile works (fields === \'getting_started\')', async () => {
      try {
        const d = await getMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          fields: 'getting_started',
        });

        expect(d).toEqual({
          ...expected.messengerProfile.get.getSuccessfully,
        });
      } catch (e) {
        throw e;
      }
    });

    test('getMessengerProfile works (fields === [\'getting_started\'])', async () => {
      try {
        const d = await getMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          fields: ['getting_started'],
        });

        expect(d).toEqual({
          ...expected.messengerProfile.get.getSuccessfully,
        });
      } catch (e) {
        throw e;
      }
    });

    test('getMessengerProfile works', async () => {
      try {
        const d = await getMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          // tslint:disable-next-line:max-line-length
          fields: 'account_linking_url,persistent_menu,get_started,greeting,whitelisted_domains,payment_settings,target_audience,home_url',
        });

        expect(d).toEqual({
          ...expected.messengerProfile.get.getSuccessfully,
        });
      } catch (e) {
        throw e;
      }
    });

  });

  describe('set', () => {
    test('Parameter url is invalid', async () => {
      try {
        await setMessengerProfile({
          url: null,
          pageAccessToken: testAppConfig.pageAccessToken,
          body: null,
        });
      } catch (e) {
        expect(e instanceof TypeError).toBe(true);
        expect(e.message)
        .toEqual('Parameter url is invalid');
      }
    });

    test('Parameter pageAccessToken is invalid', async () => {
      try {
        await setMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: null,
          body: null,
        });
      } catch (e) {
        expect(e instanceof TypeError).toBe(true);
        expect(e.message).toEqual('Parameter pageAccessToken is invalid');
      }
    });

    test('Requires one of the params: ...', async () => {
      try {
        await setMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          body: null, /** body: { get_started: null }, */
        });
      } catch (e) {
        expect(e).toEqual({
          ...expected.messengerProfile.set.requiresOneOf,
        });
      }
    });

    test('Invalid keys ...', async () => {
      try {
        await setMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          body: {
            get_started: {
              /**
               * - payload: 'FACEBOOK_WELCOME', payload2: null
               * - payload2: <null|''|'FACEBOOK_WELCOME'>
               */
              payload2: null,
            },
          },
        });
      } catch (e) {
        expect(e).toEqual({
          ...expected.messengerProfile.set.invalidKeys,
        });
      }
    });

    test('The parameter get_started[payload] is required', async () => {
      try {
        await setMessengerProfile({
          url: testAppConfig.url,
          pageAccessToken: testAppConfig.pageAccessToken,
          body: {
            /**
             * - get_started: {}
             * - get_started: { payload: <null|''> }
             */
            get_started: {
              payload: null,
            },
          },
        });
      } catch (e) {
        expect(e).toEqual({
          ...expected.messengerProfile.set.missingGetStartedPayload,
        });
      }
    });

  });

});
