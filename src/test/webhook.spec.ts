// @ts-check

/** Import project dependencies */
import express from 'express';
import rq from 'supertest';

/** Import other modules */
import handleReceiveMessage from '../handle-receive-message';
import handleReceivePostback from '../handle-receive-postback';
import webhook, { handleWebhook } from '../webhook';
import customErrorHandler from './helper/custom-error-handler';
import { testAppConfig } from './helper/test-config';

/** Mock functions with Jest */
jest.mock('../handle-receive-message', () =>
  jest.fn((config, event, opts) => ({
    config: config || { mockConfig: 1 },
    event: event || { mockEvent: 2 },
    options: opts,
  })));
jest.mock('../handle-receive-postback', () =>
  jest.fn((config, event, opts) => ({
    config: config || { mockConfig: 12 },
    event: event || { mockEvent: 22 },
    options: opts,
  })));

describe('handle-webhook', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.unmock('../handle-receive-message');
  });

  const mockApp = express()
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use('/', webhook(testAppConfig))
    .use(customErrorHandler);
  const mockSend = jest.fn(d => d);
  const mockRes = {
    headersSent: true,
    status: () => mockRes,
    send: mockSend,
  };

  test('no appConfig', async () => {
    try {
      const mockAppForTest = express()
        .use(express.json())
        .use(express.urlencoded({ extended: false }))
        .use('/', webhook(null))
        .use(customErrorHandler);
      const d = await rq(mockAppForTest)
        .post('/')
        .send({ test: 'Hello, World!' })
        .expect(400);

      expect(d.body).toEqual({
        error: {
          message: 'Parameter appConfig is undefined',
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('no req[body][object]', async () => {
    try {
      const d = await rq(mockApp)
        .post('/')
        .send({ test: 'Hello, World!' })
        .expect(400);

      expect(d.body).toEqual({
        error: {
          message: 'Parameter req[body][object] is missing',
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('no req[body][entry]', async () => {
    try {
      const d = await rq(mockApp)
        .post('/')
        .send({ object: 'page' })
        .expect(400);

      expect(d.body).toEqual({
        error: {
          message: 'Parameter req[body][entry] is missing',
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('object !== page', async () => {
    try {
      const d = await rq(mockApp)
        .post('/')
        .send({
          object: 'not-page',
          entry: 'entry',
        })
        .expect(404);

      expect(d.body).toEqual({
        error: {
          message: 'Unknown object (not-page)',
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('entry is not an array', async () => {
    try {
      const d = await rq(mockApp)
        .post('/')
        .send({
          object: 'page',
          entry: 'not-an-array',
        })
        .expect(400);

      expect(d.body).toEqual({
        error: {
          message: 'Parameter req[body][entry] is not an array',
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('no messaging in each entry', async () => {
    try {
      const mockReq = {
        body: {
          object: 'page',
          entry: [
            {
              test: 'Hello, World!',
            },
          ],
        },
      };
      await handleWebhook(testAppConfig, null, mockReq as any, mockRes as any);
    } catch (e) {
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenLastCalledWith('EVENT_RECEIVED');
      expect(e instanceof TypeError).toEqual(true);
      expect(e.message).toEqual('Parameter req[body][entry][0][messaging] is not an array');
    }
  });

  test('messaging is not an array in each entry', async () => {
    try {
      const mockReq = {
        body: {
          object: 'page',
          entry: [
            {
              messaging: 'not-an-array',
            },
          ],
        },
      };
      await handleWebhook(testAppConfig, null, mockReq as any, mockRes as any);
    } catch (e) {
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenLastCalledWith('EVENT_RECEIVED');
      expect(e instanceof TypeError).toEqual(true);
      expect(e.message).toEqual('Parameter req[body][entry][0][messaging] is not an array');
    }
  });

  test('no messageEvent in each entry', async () => {
    try {
      const mockReq = {
        body: {
          object: 'page',
          entry: [
            {
              messaging: [
                null,
                null,
              ],
            },
          ],
        },
      };
      await handleWebhook(testAppConfig, null, mockReq as any, mockRes as any);
    } catch (e) {
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenLastCalledWith('EVENT_RECEIVED');
      expect(e instanceof TypeError).toEqual(true);
      expect(e.message).toEqual('Parameter req[body][entry][0][messaging][0] is missing');
    }
  });

  test('OK, neither message nor postback', async () => {
    try {
      const mockReq = {
        body: {
          object: 'page',
          entry: [
            {
              messaging: [
                {
                  test: 'Hello, World!',
                },
              ],
            },
          ],
        },
      };
      await handleWebhook(testAppConfig, null, mockReq as any, mockRes as any);
    } catch (e) {
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenLastCalledWith('EVENT_RECEIVED');
      expect(e).toEqual(new Error('Unknown message event req[body][entry][0][messaging][0]'));
    }
  });

  test('OK message[text]', async () => {
    try {
      const mockReq = {
        body: {
          object: 'page',
          entry: [
            {
              messaging: [
                {
                  message: {
                    text: 'Hello, World!',
                  },
                },
              ],
            },
          ],
        },
      };

      await handleWebhook(testAppConfig, null, mockReq as any, mockRes as any);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenLastCalledWith('EVENT_RECEIVED');
      expect(handleReceiveMessage).toHaveBeenCalledTimes(1);
      expect(handleReceiveMessage).toHaveBeenLastCalledWith(
        testAppConfig,
        {
          message: {
            text: 'Hello, World!',
          },
        },
        null
      );
    } catch (e) {
      throw e;
    }
  });

  test('OK message[quick_reply]', async () => {
    try {
      const mockReq = {
        body: {
          object: 'page',
          entry: [
            {
              messaging: [
                {
                  message: {
                    quick_reply: {
                      payload: 'Hello, World!',
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      await handleWebhook(testAppConfig, null, mockReq as any, mockRes as any);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenLastCalledWith('EVENT_RECEIVED');
      expect(handleReceiveMessage).toHaveBeenCalledTimes(1);
      expect(handleReceiveMessage).toHaveBeenCalledWith(
        testAppConfig,
        {
          message: {
            quick_reply: {
              payload: 'Hello, World!',
            },
          },
        },
        null
      );
    } catch (e) {
      throw e;
    }
  });

  test('OK message[postback]', async () => {
    try {
      const mockReq = {
        body: {
          object: 'page',
          entry: [
            {
              messaging: [
                {
                  postback: {
                    title: 'Greeting',
                    payload: 'Hello, World!',
                  },
                },
              ],
            },
          ],
        },
      };

      await handleWebhook(testAppConfig, null, mockReq as any, mockRes as any);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenLastCalledWith('EVENT_RECEIVED');
      expect(handleReceivePostback).toHaveBeenCalledTimes(1);
      expect(handleReceivePostback).toHaveBeenCalledWith(
        testAppConfig,
        {
          postback: {
            title: 'Greeting',
            payload: 'Hello, World!',
          },
        },
        null
      );
    } catch (e) {
      throw e;
    }
  });

});
