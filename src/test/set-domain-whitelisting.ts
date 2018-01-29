// @ts-check

/** Import typings */
import { FacebookPostbackEvent } from '../handle-receive-postback';

/** Import other modules */
import setDomainWhitelisting from '../set-domain-whitelisting';
import fbId from './helper/fb-id';
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
  // const mockEventPostback: FacebookPostbackEvent = {
  //   postback: {
  //     title: 'test-postback-title',
  //     payload: 'test-postback-payload',
  //   },
  //   sender: { id: fbId(16) },
  //   recipient: { id: fbId(16) },
  // };

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
      expect(e).toEqual({});
    }
  });

});
