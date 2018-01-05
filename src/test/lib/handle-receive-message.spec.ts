// @ts-check

/** Import typings */
import { MessageflowConfig } from '../../';
import { FacebookMessageEvent, MessagePayload } from '../../lib/handle-receive-message';
import { FacebookEventId } from '../../lib/handle-webhook';

/** Import other modules */
import handleReceiveMessage from '../../lib/handle-receive-message';
import { testAppConfig } from '../test-config';
import fbId from '../util/fb-id';
import locky, { closeLocky } from '../util/locky';

/** Setting up */
const mockEvent: FacebookMessageEvent = {
  message: {
    mid: fbId(16),
    seq: +fbId(16),
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
  describe('handle-receive-message', async () => {
    describe('message[text]', async () => {
      const mockEventMessage: FacebookMessageEvent = {
        ...mockEvent,
        message: {
          ...mockEvent.message,
          text: 'ok-text',
        },
      };
      const mockConfig: MessageflowConfig = {
        ...testAppConfig,
        onMessage: async (sender: FacebookEventId, text: string) => {
          try {
            /** NOTE: Return inputs */
            return {
              sender,
              text,
            };
          } catch (e) {
            throw e;
          }
        },
      };

      test('OK response', async () => {
        try {
          expect.assertions(1);

          const d = await handleReceiveMessage({
            ...mockConfig,
            fbPageAccessToken: 'ok-message-text',
          }, mockEventMessage);

          expect(d).toEqual({
            sender: {
              id: expect.stringMatching(/\d{16}/i),
            },
            text: expect.stringMatching(/^ok\-text/i),
          });
        } catch (e) {
          throw e;
        }
      });

      test('Bad response', async () => {
        try {
          expect.assertions(2);

          await handleReceiveMessage({
            ...mockConfig,
            fbPageAccessToken: 'bad-message-text',
          }, null);
        } catch (e) {
          expect(e instanceof TypeError).toEqual(true);
          expect(e.message).toEqual('messageEvent is undefined');
        }
      });

      test('Fail request', async () => {
        try {
          expect.assertions(2);

          await handleReceiveMessage(null, null);
        } catch (e) {
          expect(e instanceof TypeError).toEqual(true);
          expect(e.message).toEqual('Only absolute URLs are supported');
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
      const mockConfig: MessageflowConfig = {
        ...testAppConfig,
        fbPageAccessToken: 'ok-message-quick-reply',
        onQuickReply: async (sender: FacebookEventId, quickReply: MessagePayload) => {
          try {
            /** NOTE: Return inputs */
            return {
              sender,
              quick_reply: quickReply,
            };
          } catch (e) {
            throw e;
          }
        },
      };

      test('OK response', async () => {
        try {
          expect.assertions(1);

          const d = await handleReceiveMessage(mockConfig, mockEventQuickReply);

          expect(d).toEqual({
            quick_reply: {
              payload: expect.stringMatching(/^ok-quick-reply-payload/i),
            },
            sender: {
              id: expect.stringMatching(/\d{16}/i),
            },
          });
        } catch (e) {
          throw e;
        }
      });

      test('Bad response', async () => {
        try {
          expect.assertions(2);

          await handleReceiveMessage({
            ...mockConfig,
            fbPageAccessToken: 'bad-message-quick-reply',
          }, null);
        } catch (e) {
          expect(e instanceof TypeError).toEqual(true);
          expect(e.message).toEqual('messageEvent is undefined');
        }
      });

      test('Fail request', async () => {
        try {
          expect.assertions(2);

          await handleReceiveMessage(null, null);
        } catch (e) {
          expect(e instanceof TypeError).toEqual(true);
          expect(e.message).toEqual('Only absolute URLs are supported');
        }
      });
    });

  });
});
