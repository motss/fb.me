// @ts-check

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import rq from 'supertest';
import verifySetup from '../../lib/verify-setup';

describe('verify-setup', async () => {
  const mockFbVerifyToken = 'mock-fb-verify-token';
  const mockApp = express()
    .use('/', verifySetup(mockFbVerifyToken))
    .use((err, _, res, next) => {
      if (err instanceof Error) {
        if (/^hub.verify_token/i.test(err.message)) {
          return res.status(400).send({
            status: 400,
            message: err.message,
          });
        }

        return res.status(500).send({
          status: 500,
          message: 'Server error',
        });
      }

      return next(err);
    });

  test('OK response', async () => {
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

  test('Bad request', async () => {
    try {
      const d = await rq(mockApp)
        .get(`/?hub.verify_token=bad-${mockFbVerifyToken}`)
        .expect(200);

      expect(d.text).toEqual('Error, wrong validation token');
    } catch (e) {
      throw e;
    }
  });

  test('Fail request', async () => {
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
});
