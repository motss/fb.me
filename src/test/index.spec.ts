// @ts-check

/** Import typings */
import { MessageflowParams } from '../';

/** Import project dependencies */
import express from 'express';
import rq from 'supertest';

/** Import other modules */
import messageflow from '../';
import { testAppConfig } from './test-config';

describe('index', async () => {
  const config: MessageflowParams = {
    appId: testAppConfig.fbAppId,
    fetchTimeout: testAppConfig.appFetchTimeout,
    graphUrl: testAppConfig.fbGraphUrl,
    notificationType: testAppConfig.fbNotificationType,
    pageAccessToken: testAppConfig.fbPageAccessToken,
    pageId: testAppConfig.fbPageId,
    typingDelay: testAppConfig.fbTypingDelay,
    verifyToken: testAppConfig.fbVerifyToken,
  };
  const mockApp = express()
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use('/', messageflow(config));

  test('verifySetup has been called', async () => {
    try {
      const d = await rq(mockApp)
        .get('/')
        .expect(400);

      expect(d.body).toEqual({
        status: 400,
        message: 'hub.mode is missing',
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
        status: 400,
        message: 'req[body][object] is missing',
      });
    } catch (e) {
      throw e;
    }
  });
});
