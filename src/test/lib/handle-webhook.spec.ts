// @ts-check

/** Import typings */
import { WebhookResponse } from '../../lib/handle-webhook';

/** Import project dependencies */
import express from 'express';
import rq from 'supertest';

/** Import other modules */
import handleWebhook from '../../lib/handle-webhook';
import { testAppConfig } from '../test-config';
import { fbId } from '../util/fb-id';

// tslint:disable-next-line:no-var-requires
const handleReceiveMessage = require('../../lib/handle-receive-message');
// tslint:disable-next-line:no-var-requires
// const handleReceivePostback = require('../../lib/handle-receive-postback');

jest.mock('../../lib/handle-receive-message', () => {
  return jest.fn((config, event) => {
    return {
      config: config || { haha: 1 },
      event: event || { lol: 2 },
    };
  });
});

describe('handle-webhook', async () => {
  const mockApp = express()
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use('/', handleWebhook(testAppConfig));

  console.log('@@@', handleReceiveMessage);

  describe('message[text]', async () => {
    test('OK response', async () => {
      try {
        const mockBodyForMessageText = {
          object: 'page',
          entry: [
            {
              messaging: [
                {
                  sender: { id: fbId(16) },
                  recipient: { id: fbId(16) },
                  message: {
                    mid: fbId(16),
                    seq: +fbId(16),
                    text: 'mock-message-text',
                  },
                },
              ],
            },
          ],
        };
        const d = await rq(mockApp)
          .post('/')
          .set('content-type', 'application/json')
          .send(mockBodyForMessageText)
          .expect(200);

        expect(d.text).toMatch(/^ok/i);
        expect(handleReceiveMessage)
          .toHaveBeenCalledWith(
            testAppConfig,
            mockBodyForMessageText.entry[0].messaging[0]
          );
      } catch (e) {
        throw e;
      }
    });
  });

  // describe('message[quick_reply]', async () => { });
  // describe('postback', async () => {});
});
