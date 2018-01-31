// @ts-check

/** Import typings */
import { MessageflowConfig } from '../';

/** Import project dependencies */
import express from 'express';
import rq from 'supertest';

/** Import other modules */
import messageflow from '../';
import * as expected from './helper/expected';
import locky, { closeLocky } from './helper/locky';
import { testAppConfig } from './helper/test-config';

describe('index', () => {
  beforeEach(async () => await locky(testAppConfig));

  afterEach(async () => await closeLocky());

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
          message: 'Parameter verifyToken is invalid',
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
          message: 'Parameter hub.mode is missing',
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
          message: 'Parameter req[body][object] is missing',
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('handleMessengerCode has been called', async () => {
    try {
      const d = await rq(
        express()
          .use('/', messageflow(config))
      )
        // .get('/messenger-code?ref=haha&image_size=1999')
        .get('/messenger-code')
        .expect(200);

      expect(d.body).toEqual({
        ...expected.messengerCode.codedSuccessfully,
      });
    } catch (e) {
      throw e;
    }
  });

});
