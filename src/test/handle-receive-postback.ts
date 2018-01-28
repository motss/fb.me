// @ts-check

/** Import typings */
import { MessageflowConfig } from '../';
import {
  FacebookPostbackEvent,
  FacebookPostbackEventPostback,
} from '../handle-receive-postback';
import { FacebookEventId } from '../handle-webhook';

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
const mockEvent: FacebookPostbackEvent = {
  postback: {
    title: 'mock-postback-title',
    payload: 'mock-postback-payload',
  },
  sender: { id: fbId(16) },
  recipient: { id: fbId(16) },
};

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

describe('lib', () => {
  describe('handle-receive-postback', async () => {
    describe('postback', async () => {
      const mockEventPostback: FacebookPostbackEvent = {
        ...mockEvent,
      };
      const mockConfig: MessageflowConfig = {
        ...testAppConfig,
        onPostback: async (sender: FacebookEventId, postback: FacebookPostbackEventPostback) => {
          try {
            /** NOTE: Return inputs */
            return {
              sender,
              postback,
            };
          } catch (e) {
            throw e;
          }
        },
      };

      test('OK response', async () => {
        try {
          expect.assertions(1);

          const d = await handleReceivePostback({
            ...mockConfig,
            fbPageAccessToken: 'ok-message-postback',
          }, mockEventPostback);

          expect(d).toEqual({
            sender: {
              id: expect.stringMatching(/\d{16}/i),
            },
            postback: {
              title: expect.stringMatching(/^mock-postback-title/i),
              payload: expect.stringMatching(/^mock-postback-payload/i),
            },
          });
        } catch (e) {
          throw e;
        }
      });

      test('Bad response', async () => {
        try {
          expect.assertions(2);

          const d = await handleReceivePostback({
            ...mockConfig,
            fbPageAccessToken: 'bad-message-postback',
          }, null);

          expect(d.sender).toEqual(undefined);
          expect(d.postback).toEqual(undefined);
        } catch (e) {
          throw e;
        }
      });

      test('Fail request', async () => {
        try {
          expect.assertions(2);

          await handleReceivePostback(null, null);
        } catch (e) {
          expect(e instanceof TypeError).toEqual(true);
          expect(e.message).toEqual('Only absolute URLs are supported');
        }
      });
    });

  });
});
