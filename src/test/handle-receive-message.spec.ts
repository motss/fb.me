// @ts-check

/** Import typings */
import { FacebookMessageEvent } from '../handle-receive-message';

/** Import other modules */
import handleReceiveMessage from '../handle-receive-message';
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
//           message: {
//             mid: 'mid.$cAAIwd39I0sNnJYgb2lg9ELTYYqWT',
//             seq: 89498,
//             text: 'hello, world!',

//             /** Quick reply has this */
//             quick_reply: {
//               payload: 'random payload',
//             },
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

describe('handle-receive-message', () => {
  const mockEvent: FacebookMessageEvent = {
    message: {
      mid: fbId(16),
      seq: +fbId(16),
    },
    sender: { id: fbId(16) },
    recipient: { id: fbId(16) },
  };

  test('messageEvent is undefined', async () => {
    try {
      await handleReceiveMessage({
        ...testAppConfig,
        pageAccessToken: 'ok-test-page-access-token',
      }, null);
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toEqual('messageEvent is undefined');
    }
  });

  describe('message[text]', async () => {
    const mockEventMessage: FacebookMessageEvent = {
      ...mockEvent,
      message: {
        ...mockEvent.message,
        text: 'ok-text',
      },
    };

    test('onMessage is not a function', async () => {
      try {
        await handleReceiveMessage({
          ...testAppConfig,
          pageAccessToken: 'ok-tset-page-access-token',
        }, mockEventMessage);
      } catch (e) {
        expect(e instanceof TypeError).toBe(true);
        expect(e.message).toEqual('onMessage is not a function');
      }
    });

    test('onMessage works', async () => {
      try {
        const mockOnMessage = jest.fn(async (sender, text) => ({
          sender,
          text,
        }));
        const d = await handleReceiveMessage({
          ...testAppConfig,
          pageAccessToken: 'ok-test-page-access-token',
          onMessage: mockOnMessage,
        }, mockEventMessage);

        expect(mockOnMessage).toHaveBeenCalledTimes(1);
        expect(mockOnMessage).toHaveBeenLastCalledWith(
          mockEventMessage.sender,
          mockEventMessage.message.text
        );
        expect(d).toEqual({
          sender: {
            id: expect.any(String),
          },
          text: 'ok-text',
        });
      } catch (e) {
        throw e;
      }
    });

  });

  describe('message[quick_reply]', async () => {
    const mockEventQuickReply: FacebookMessageEvent = {
      ...mockEvent,
      message: {
        ...mockEvent.message,
        quick_reply: {
          payload: 'ok-quick-reply-payload',
        },
      },
    };

    test('onQuickReply is not a function', async () => {
      try {
        await handleReceiveMessage({
          ...testAppConfig,
          pageAccessToken: 'ok-tset-page-access-token',
        }, mockEventQuickReply);
      } catch (e) {
        expect(e instanceof TypeError).toBe(true);
        expect(e.message).toEqual('onQuickReply is not a function');
      }
    });

    test('onQuickReply works', async () => {
      try {
        const mockOnQuickReply = jest.fn(async (sender, quickReply) => ({
          sender,
          quick_reply: quickReply,
        }));
        const d = await handleReceiveMessage({
          ...testAppConfig,
          pageAccessToken: 'ok-test-page-access-token',
          onQuickReply: mockOnQuickReply,
        }, mockEventQuickReply);

        expect(mockOnQuickReply).toHaveBeenCalledTimes(1);
        expect(mockOnQuickReply).toHaveBeenLastCalledWith(
          mockEventQuickReply.sender,
          mockEventQuickReply.message.quick_reply
        );
        expect(d).toEqual({
          sender: {
            id: expect.any(String),
          },
          quick_reply: {
            payload: 'ok-quick-reply-payload',
          },
        });
      } catch (e) {
        throw e;
      }
    });

  });

});
