// @ts-check

/** Import typings */
import { MessageflowConfig } from '../';

/** Import project dependencies */
import express from 'express';
import rq from 'supertest';

/** Import other modules */
import handleMessengerCode from '../handle-messenger-code';
import * as expected from './helper/expected';
import locky, { closeLocky } from './helper/locky';
import { testAppConfig } from './helper/test-config';

describe('handle-webhook', () => {
  beforeEach(async () => await locky(testAppConfig));

  afterEach(async () => await closeLocky());

  const mockApp = express()
    .get('/', handleMessengerCode(testAppConfig));
  const mockSend = jest.fn(d => d);
  const mockRes = {
    headersSent: true,
    status: () => mockRes,
    send: mockSend,
  };
  const sentQuery = {
    ref: '',
    image_size: 1000,
  };

  test('Parameter appConfig is undefined', async () => {
    try {
      const mockAppForTest = express()
        .get('/', handleMessengerCode(null));
      const d = await rq(mockAppForTest)
        .get('/')
        .query({ ...sentQuery })
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

  test('not found error', async () => {
    try {
      const mockAppForTest = express()
        .get('/', handleMessengerCode({
          url: testAppConfig.url,
          pageAccessToken: `error-${testAppConfig.pageAccessToken}`,
        } as MessageflowConfig));
      const d = await rq(mockAppForTest)
        .get('/')
        .query({ ...sentQuery })
        .expect(404);

      expect(d.body).toEqual({
        error: {
          message: 'Not found',
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('handleMessengerCode works', async () => {
    try {
      const d = await rq(mockApp)
        .get('/')
        .query({ ...sentQuery })
        .expect(200);

      expect(d.body).toEqual({
        ...expected.messengerCode.codedSuccessfully,
      });
    } catch (e) {
      throw e;
    }
  });

});
