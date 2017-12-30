// @ts-check

/** Import typings */
import { FacebookMessageEvent } from '../../lib/handle-receive-message';
import { FacebookPostbackEvent } from '../../lib/handle-receive-postback';
import { WebhookResponse } from '../../lib/handle-webhook';

/** Import project dependencies */
import express from 'express';
import rq from 'supertest';

/** Import other modules */
import handleReceivePostback from '../../lib/handle-receive-postback';
import handleWebhook from '../../lib/handle-webhook';
import { testAppConfig } from '../test-config';
import fbId from '../util/fb-id';

// tslint:disable-next-line:no-var-requires
const handleReceiveMessage = require('../../lib/handle-receive-message');
// tslint:disable-next-line:no-var-requires
// const handleReceivePostback = require('../../lib/handle-receive-postback');

jest.mock('../../lib/handle-receive-message', () =>
  jest.fn((config, event) => ({
    config: config || { mockConfig: 1 },
    event: event || { mockEvent: 2 },
  })));
jest.mock('../../lib/handle-receive-postback', () =>
  jest.fn((config, event) => ({
    config: config || { mockConfig: 12 },
    event: event || { mockEvent: 22 },
  })));

describe('handle-webhook', async () => {
  const mockApp = express()
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use('/', handleWebhook(testAppConfig))
    .use((err, req, res, next) => {
      console.error('@ Fatal error', err);
    });
  const mockMessagingMessage: FacebookMessageEvent = {
    sender: { id: fbId(16) },
    recipient: { id: fbId(16) },
    message: {
      mid: fbId(16),
      seq: +fbId(16),
    },
  };
  const mockMessagingPostback: FacebookPostbackEvent = {
    sender: { id: fbId(16) },
    recipient: { id: fbId(16) },
    postback: {
      title: '',
      payload: '',
    },
  };

  test('message[text]', async () => {
    try {
      const mockBody: WebhookResponse = {
        object: 'page',
        entry: [
          {
            messaging: [
              {
                ...mockMessagingMessage,
                message: {
                  ...mockMessagingMessage.message,
                  text: 'mock-message-text',
                },
              },
            ],
          },
        ],
      };
      const d = await rq(mockApp)
        .post('/')
        .send(mockBody)
        .expect(200);

      expect(d.text).toMatch(/^ok/i);
      expect(handleReceiveMessage)
        .toHaveBeenCalledWith(
          testAppConfig,
          mockBody.entry[0].messaging[0]
        );
    } catch (e) {
      throw e;
    }
  });

  test('message[quick_reply]', async () => {
    try {
      const mockBody: WebhookResponse = {
        object: 'page',
        entry: [
          {
            messaging: [
              {
                ...mockMessagingMessage,
                message: {
                  ...mockMessagingMessage.message,
                  quick_reply: {
                    payload: 'mock-message-quick-reply',
                  },
                },
              },
            ],
          },
        ],
      };
      const d = await rq(mockApp)
        .post('/')
        .send(mockBody)
        .expect(200);

      expect(d.text).toMatch(/^ok/i);
      expect(handleReceiveMessage)
        .toHaveBeenCalledWith(
          testAppConfig,
          mockBody.entry[0].messaging[0]
        );
    } catch (e) {
      throw e;
    }
  });

  test('postback', async () => {
    try {
      const mockBody: WebhookResponse = {
        object: 'page',
        entry: [
          {
            messaging: [
              {
                ...mockMessagingPostback,
                postback: {
                  title: 'mock-postback-postback-title',
                  payload: 'mock-postback-postback-payload',
                },
              },
            ],
          },
        ],
      };
      const d = await rq(mockApp)
        .post('/')
        .send(mockBody)
        .expect(200);

      expect(d.text).toMatch(/^ok/i);
      expect(handleReceivePostback).toHaveBeenCalledWith(
        testAppConfig,
        mockBody.entry[0].messaging[0]
      );
    } catch (e) {
      throw e;
    }
  });

  test('appConfig is undefined', async () => {
    try {
      const mockAppForTest = express()
        .use('/', handleWebhook(undefined))
        .use((err, req, res, next) => console.error('no app config', err));
      const d = await rq(mockAppForTest)
        .post('/')
        .expect(200);

      expect(d.text).toMatch(/^ok/i);
    } catch (e) {
      throw e;
    }
  });

  const ff = handleWebhook.toString().split(/\r?\n/);
  console.log('#', ff[13]);
  console.log('#', ff[14]);
  console.log('#', ff[15]);

  test('object !== page', async () => {
    try {
      const mockBody = {
        object: 'not-page',
        entry: [],
      };
      const d = await rq(mockApp)
        .post('/')
        .send(mockBody)
        .expect(200);

      expect(d.text).toMatch(/^ok/i);
    } catch (e) {
      throw e;
    }
  });

  test('entry is not an array', async () => {
    try {
      const mockBody = {
        object: 'page',
        entry: 'entry-not-array',
      };
      const d = await rq(mockApp)
        .post('/')
        .send(mockBody)
        .expect(200);

      expect(d.text).toMatch(/^ok/i);
    } catch (e) {
      throw e;
    }
  });

  test('pageEntry is undefined', async () => {
    try {
      const mockBody = {
        object: 'page',
        entry: [
          undefined,
          undefined,
        ],
      };
      const d = await rq(mockApp)
        .post('/')
        .send(mockBody)
        .expect(200);

      expect(d.text).toMatch(/^ok/i);
    } catch (e) {
      throw e;
    }
  });

  test('pageEntry.message is not an array', async () => {
    try {
      const mockBody = {
        object: 'page',
        entry: [
          {
            messaging: 'messaging-not-array',
          },
        ],
      };
      const d = await rq(mockApp)
        .post('/')
        .send(mockBody)
        .expect(200);

      expect(d.text).toMatch(/^ok/i);
    } catch (e) {
      throw e;
    }
  });

  test('messageEvent is undefined', async () => {
    try {
      const mockBody = {
        object: 'page',
        entry: [
          {
            messaging: [
              { mock: 1 },
              { mock: 2 },
            ],
          },
        ],
      };
      const d = await rq(mockApp)
        .post('/')
        .send(mockBody)
        .expect(200);

      expect(d.text).toMatch(/^ok/i);
    } catch (e) {
      throw e;
    }
  });
});
