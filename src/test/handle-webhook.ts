// @ts-check

/** Import project dependencies */
import express from 'express';
import rq from 'supertest';

/** Import other modules */
import handleReceiveMessage from '../handle-receive-message';
import handleReceivePostback from '../handle-receive-postback';
import handleWebhook, { postWebhook } from '../handle-webhook';
import { testAppConfig } from './helper/test-config';

/** Mock functions with Jest */
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

describe('lib', () => {
  describe('handle-webhook', async () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.unmock('../../lib/handle-receive-message');
    });

    const mockApp = express()
      .use(express.json())
      .use(express.urlencoded({ extended: false }))
      .use('/', handleWebhook(testAppConfig));
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
          .use('/', handleWebhook(null));
        const d = await rq(mockAppForTest)
          .post('/')
          .send({ test: 'Hello, World!' })
          .expect(400);

        expect(d.body).toEqual({
          status: 400,
          message: 'appConfig is invalid',
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
          status: 400,
          message: 'req[body][object] is missing',
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
          status: 400,
          message: 'req[body][entry] is missing',
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
          status: 404,
          message: 'Unknown object (not-page)',
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
          status: 400,
          message: 'req[body][entry] is not an array',
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
        await postWebhook(testAppConfig, mockReq as any, mockRes as any);
      } catch (e) {
        expect(mockSend).toHaveBeenCalledWith('EVENT_RECEIVED');
        expect(e instanceof TypeError).toEqual(true);
        expect(e.message).toEqual('req[body][entry][0][messaging] is missing');
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
        await postWebhook(testAppConfig, mockReq as any, mockRes as any);
      } catch (e) {
        expect(mockSend).toHaveBeenCalledWith('EVENT_RECEIVED');
        expect(e instanceof TypeError).toEqual(true);
        expect(e.message).toEqual('req[body][entry][0][messaging] is not an array');
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
        await postWebhook(testAppConfig, mockReq as any, mockRes as any);
      } catch (e) {
        expect(mockSend).toHaveBeenCalledWith('EVENT_RECEIVED');
        expect(e instanceof TypeError).toEqual(true);
        expect(e.message).toEqual('req[body][entry][0][messaging][0] is missing');
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
        const d = await postWebhook(testAppConfig, mockReq as any, mockRes as any);

        expect(mockSend).toHaveBeenCalledWith('EVENT_RECEIVED');
        expect(d).toEqual([
          {
            test: 'Hello, World!',
          },
        ]);
      } catch (e) {
        throw e;
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

        await postWebhook(testAppConfig, mockReq as any, mockRes as any);

        expect(mockSend).toHaveBeenCalledWith('EVENT_RECEIVED');
        expect(handleReceiveMessage).toHaveBeenCalledWith(testAppConfig, {
          message: {
            text: 'Hello, World!',
          },
        });
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

        await postWebhook(testAppConfig, mockReq as any, mockRes as any);

        expect(mockSend).toHaveBeenCalledWith('EVENT_RECEIVED');
        expect(handleReceiveMessage).toHaveBeenCalledWith(testAppConfig, {
          message: {
            quick_reply: {
              payload: 'Hello, World!',
            },
          },
        });
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

        await postWebhook(testAppConfig, mockReq as any, mockRes as any);

        expect(mockSend).toHaveBeenCalledWith('EVENT_RECEIVED');
        expect(handleReceivePostback).toHaveBeenCalledWith(testAppConfig, {
          postback: {
            title: 'Greeting',
            payload: 'Hello, World!',
          },
        });
      } catch (e) {
        throw e;
      }
    });

  });
});
