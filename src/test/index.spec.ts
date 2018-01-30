// @ts-check

/** Import typings */
import { MessageflowConfig } from '../';

/** Import project dependencies */
import express from 'express';
import rq from 'supertest';

/** Import other modules */
import messageflow from '../';
import { testAppConfig } from './helper/test-config';

describe('index', () => {
  const config: MessageflowConfig = {
    appId: testAppConfig.appId,
    pageAccessToken: testAppConfig.pageAccessToken,
    pageId: testAppConfig.pageId,
    url: testAppConfig.url,
    verifyToken: testAppConfig.verifyToken,

    fetchTimeout: testAppConfig.fetchTimeout,
    notificationType: testAppConfig.notificationType,
    typingDelay: testAppConfig.typingDelay,
  };
  const mockApp = express()
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use('/', messageflow(config));

  test('nullish config fallback to {}', async () => {
    try {
      const d = await rq(express().use('/', messageflow()))
        .get('/')
        .expect(400);

      expect(d.body).toEqual({
        error: {
          message: 'verifyToken is invalid',
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('verifySetup has been called', async () => {
    try {
      const d = await rq(mockApp)
        .get('/')
        .expect(400);

      expect(d.body).toEqual({
        error: {
          message: 'hub.mode is missing',
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('handleWebhook has been called', async () => {
    try {
      const d = await rq(mockApp)
        .post('/')
        .expect(400);

      expect(d.body).toEqual({
        error: {
          message: 'req[body][object] is missing',
        },
      });
    } catch (e) {
      throw e;
    }
  });

});
