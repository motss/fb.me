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

  test('no hub.verify_token', async () => {
    try {
      const d = await rq(mockApp)
        .get('/')
        .expect(400);

      expect(d.body).toEqual({
        status: 400,
        message: 'hub.verify_token is missing',
      });
    } catch (e) {
      throw e;
    }
  });

  test('verify tokens match', async () => {
    try {
      const d = await rq(mockApp)
        .get(`/?hub.verify_token=${mockFbVerifyToken}`)
        .expect(200);

      expect(d.body).toEqual({
        'hub.verify_token': mockFbVerifyToken,
      });
    } catch (e) {
      throw e;
    }
  });

  test('verify token not match', async () => {
    try {
      const d = await rq(mockApp)
        .get('/?hub.verify_token=wrong-verify-token')
        .expect(200);

      expect(d.text).toEqual('Error, wrong validation token');
    } catch (e) {
      throw e;
    }
  });

  // test('Bad request', async () => {
  //   try {
  //     const d = await rq(mockApp)
  //       .get(`/?hub.verify_token=bad-${mockFbVerifyToken}`)
  //       .expect(200);

  //     expect(d.text).toEqual('Error, wrong validation token');
  //   } catch (e) {
  //     throw e;
  //   }
  // });

  // test('Fail request', async () => {
  //   try {
  //     const d = await rq(mockApp)
  //       .get('/')
  //       .expect(400);

  //     expect(d.body).toEqual({
  //       status: 400,
  //       message: 'hub.verify_token is missing',
  //     });
  //   } catch (e) {
  //     throw e;
  //   }
  // });
});
