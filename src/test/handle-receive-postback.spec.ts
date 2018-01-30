// @ts-check

/** Import typings */
import { FacebookPostbackEvent } from '../handle-receive-postback';

/** Import other modules */
import handleReceivePostback from '../handle-receive-postback';
import fbId from './helper/fb-id';
import locky, { closeLocky } from './helper/locky';
import { testAppConfig } from './helper/test-config';

/** Setting up */
// const mockReqBody = {
//   object: 'page',
//   entry: [
//     {
//       id: fbId(15),
//       time: +new Date(),
//       messaging: [
//         {
//           sender: {
//             id: fbId(15),
//           },
//           recipient: {
//             id: fbId(15), /** Same as entry[id] */
//           },
//           timestamp: +new Date(),
//           postback: {
//             payload: 'random payload',
//             title: 'Payload title',
//           },
//         },
//       ],
//     },
//   ],
// };

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

describe('handle-receive-postback', () => {
  const mockEventPostback: FacebookPostbackEvent = {
    postback: {
      title: 'test-postback-title',
      payload: 'test-postback-payload',
    },
    sender: { id: fbId(16) },
    recipient: { id: fbId(16) },
  };

  test('url is invalid', async () => {
    try {
      await handleReceivePostback(null, null);
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toEqual('url is invalid');
    }
  });

  test('pageAccessToken is invalid', async () => {
    try {
      await handleReceivePostback({
        appId: null,
        pageAccessToken: null,
        pageId: null,
        url: 'https://test-url/test-url',
        verifyToken: null,
      }, null);
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toEqual('pageAccessToken is invalid');
    }
  });

  test('postbackEvent is undefined', async () => {
    try {
      await handleReceivePostback({
        ...testAppConfig,
        pageAccessToken: 'ok-test-message-postback',
      }, null);
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toEqual('postbackEvent is undefined');
    }
  });

  test('onPostback is not a function', async () => {
    try {
      await handleReceivePostback({
        ...testAppConfig,
        pageAccessToken: 'ok-test-message-postback',
      }, mockEventPostback);
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toEqual('onPostback is not a function');
    }
  });

  test('onPostback works', async () => {
    try {
      const mockOnPostback = jest.fn((sender, postback) => ({
        sender,
        postback,
      }));
      const d = await handleReceivePostback({
        ...testAppConfig,
        pageAccessToken: 'ok-test-message-postback',
        onPostback: mockOnPostback,
      }, mockEventPostback);

      expect(mockOnPostback).toHaveBeenCalledTimes(1);
      expect(mockOnPostback).toHaveBeenLastCalledWith(
        {
          id: expect.any(String),
        },
        {
          title: 'test-postback-title',
          payload: 'test-postback-payload',
        }
      );
      expect(d).toEqual({
        sender: { ...mockEventPostback.sender },
        postback: { ...mockEventPostback.postback },
      });
    } catch (e) {
      throw e;
    }
  });

});
