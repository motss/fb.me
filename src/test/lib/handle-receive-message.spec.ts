// @ts-check

/** Import typings */
import {
  FacebookMessageEvent,
  MessagePayload,
} from '../../lib/handle-receive-message';
import { FacebookEventId } from '../../lib/handle-webhook';
import { AppConfig } from '../../lib/server';

/** Import other modules */
import handleReceiveMessage from '../../lib/handle-receive-message';
import fbId from '../util/fb-id';

/** Setting up */
// const mockSendReadReceipt = jest.mock('../../helper/send-read-receipt', () => {
//   return jest.fn(() => 'this is a mock');
// });

export async function testOKRequestForText(
  appConfig: AppConfig,
  event: FacebookMessageEvent
) {
  try {
    const d = await handleReceiveMessage(appConfig, event);

    // expect(mockSendReadReceipt).toHaveBeenCalled();
    // TODO: To mock sendReadReceipt.
    expect(d).toEqual('test-message');
  } catch (e) {
    throw e;
  }
}

export async function testOKRequestForQuickReply(
  appConfig: AppConfig,
  event: FacebookMessageEvent
) {
  try {
    const d = await handleReceiveMessage(appConfig, event);

    expect(d).toMatchObject({
      payload: expect.stringContaining('test-quick-reply'),
    });
  } catch (e) {
    throw e;
  }
}

export async function testBadRequest(
  appConfig: AppConfig,
  event?: FacebookMessageEvent
) {
  try {
    await handleReceiveMessage(appConfig, event);
  } catch (e) {
    expect(e).toEqual(new TypeError('messageEvent is undefined'));
  }
}

export async function handleReceiveMessageSpec() {
  try {
    const okAppConfig: AppConfig = {
      appFetchTimeout: 9e3,
      fbAppId: await fbId(16),
      fbGraphUrl: 'http://localhost:5353',
      fbNotificationType: 'NO_PUSH',
      fbPageAccessToken: 'ok-test-page-access-token',
      fbPageId: await fbId(16),
      fbVerifyToken: '',
      fbTypingDelay: 5e2,

      onMessage: async (sender: FacebookEventId, text: string) => {
        expect(sender).toMatchObject({
          id: expect.stringMatching(/\d{16}/),
        });
        expect(text).toEqual('test-message');

        return text;
      },
      onQuickReply: async (sender: FacebookEventId, quickReply: MessagePayload) => {
        expect(sender).toMatchObject({
          id: expect.stringMatching(/\d{16}/),
        });
        expect(quickReply).toMatchObject({
          payload: expect.stringContaining('test-quick-reply'),
        });

        return quickReply;
      },
    };
    const testEventForText: FacebookMessageEvent = {
      message: {
        mid: await fbId(16),
        seq: +await fbId(16),
        text: 'test-message',
      },
      sender: { id: await fbId(16) },
      recipient: { id: await fbId(16) },
    };
    const testEventForQuickReply: FacebookMessageEvent = {
      message: {
        mid: await fbId(16),
        seq: +await fbId(16),
        quick_reply: {
          payload: 'test-quick-reply',
        },
      },
      sender: { id: await fbId(16) },
      recipient: { id: await fbId(16) },
    };

    expect.assertions(7);

    await testOKRequestForText(okAppConfig, testEventForText);
    await testOKRequestForQuickReply(okAppConfig, testEventForQuickReply);

    await testBadRequest(okAppConfig, undefined);
  } catch (e) {
    throw e;
  }
}

export default handleReceiveMessageSpec;
