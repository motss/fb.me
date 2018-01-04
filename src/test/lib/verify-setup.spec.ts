// @ts-check

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import rq from 'supertest';
import verifySetup from '../../lib/verify-setup';

describe('verify-setup', async () => {
  const mockFbVerifyToken = 'mock-fb-verify-token';
  const mockApp = express()
    .use('/', verifySetup(mockFbVerifyToken));

  test('no verifyToken', async () => {
    try {
      const mockAppForTest = express()
        .use('/', verifySetup(null));
      const d = await rq(mockAppForTest)
        .get('/')
        .expect(400);

      expect(d.body).toEqual({
        status: 400,
        message: 'verifyToken is invalid',
      });
    } catch (e) {
      throw e;
    }
  });

  test('no hub.mode', async () => {
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

  test('no hub.verify_token', async () => {
    try {
      const d = await rq(mockApp)
        .get('/?hub.mode=subscribe')
        .expect(400);

      expect(d.body).toEqual({
        status: 400,
        message: 'hub.verify_token is missing',
      });
    } catch (e) {
      throw e;
    }
  });

  test('no hub.challenge', async () => {
    try {
      const d = await rq(mockApp)
        .get(`/?hub.mode=subscribe&hub.verify_token=${mockFbVerifyToken}`)
        .expect(400);

      expect(d.body).toEqual({
        status: 400,
        message: 'hub.challenge is missing',
      });
    } catch (e) {
      throw e;
    }
  });

  test('hub.mode !== subscribe', async () => {
    try {
      const d = await rq(mockApp)
        .get(`/?hub.mode=unsubscribe&hub.verify_token=${
          mockFbVerifyToken
        }&hub.challenge=CHALLENGE_ACCEPTED`)
        .expect(403);

      expect(d.body).toEqual({
        status: 403,
        message: 'Forbidden',
      });
    } catch (e) {
      throw e;
    }
  });

  test('verify tokens do not match', async () => {
    try {
      const d = await rq(mockApp)
        .get('/?hub.mode=subscribe&hub.verify_token=wrong-verify-token&hub.challenge=NOT_MATCH')
        .expect(403);

      expect(d.body).toEqual({
        status: 403,
        message: 'Forbidden',
      });
    } catch (e) {
      throw e;
    }
  });

  test('verify tokens match', async () => {
    try {
      const d = await rq(mockApp)
        .get(`/?hub.mode=subscribe&hub.verify_token=${
          mockFbVerifyToken
        }&hub.challenge=CHALLENGE_ACCEPTED`)
        .expect(200);

      expect(d.text).toEqual('CHALLENGE_ACCEPTED');
    } catch (e) {
      throw e;
    }
  });
});
