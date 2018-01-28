// @ts-check

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import rq from 'supertest';
import verifySetup, { getVerifySetup } from '../verify-setup';
import fbId from './helper/fb-id';

describe('verify-setup', () => {
  const mockFbChallenge = fbId(10);
  const mockFbVerifyToken = 'mock-fb-verify-token';
  const mockSend = jest.fn(d => d);
  const mockRes = {
    headersSent: true,
    status: () => mockRes,
    send: mockSend,
  };

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
      const mockReq = {
        query: {},
      };
      await getVerifySetup(mockFbVerifyToken, mockReq as any, null);
    } catch (e) {
      expect(e instanceof TypeError).toEqual(true);
      expect(e.message).toEqual('hub.mode is missing');
    }
  });

  test('no hub.verify_token', async () => {
    try {
      const mockReq = {
        query: {
          'hub.mode': 'subscribe',
        },
      };
      await getVerifySetup(mockFbVerifyToken, mockReq as any, null);
    } catch (e) {
      expect(e instanceof TypeError).toEqual(true);
      expect(e.message).toEqual('hub.verify_token is missing');
    }
  });

  test('no hub.challenge', async () => {
    try {
      const mockReq = {
        query: {
          'hub.mode': 'subscribe',
          'hub.verify_token': mockFbVerifyToken,
        },
      };
      await getVerifySetup(mockFbVerifyToken, mockReq as any, null);
    } catch (e) {
      expect(e instanceof TypeError).toEqual(true);
      expect(e.message).toEqual('hub.challenge is missing');
    }
  });

  test('forbidden', async () => {
    try {
      const mockReq = {
        query: {
          'hub.mode': 'unsubscribe',
          'hub.verify_token': mockFbVerifyToken,
        },
      };
      await getVerifySetup(mockFbVerifyToken, mockReq as any, null);
    } catch (e) {
      expect(e instanceof TypeError).toEqual(true);
      expect(e.message).toEqual('hub.challenge is missing');
    }
  });

  test('test error handler', async () => {
    try {
      const d = await rq(express().use('/', verifySetup(mockFbVerifyToken)))
        .get('/')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': 'test',
          'hub.challenge': mockFbChallenge,
        })
        .expect(403);

      expect(d.body).toEqual({
        status: 403,
        message: 'Forbidden',
      });
    } catch (e) {
      throw e;
    }
  });

  test('getVerifySetup works', async () => {
    try {
      const mockReq = {
        query: {
          'hub.mode': 'subscribe',
          'hub.verify_token': mockFbVerifyToken,
          'hub.challenge': mockFbChallenge,
        },
      };
      const d = await getVerifySetup(mockFbVerifyToken, mockReq as any, mockRes as any);

      expect(d).toEqual(mockFbChallenge);
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenLastCalledWith(mockFbChallenge);
    } catch (e) {
      throw e;
    }
  });

  test('verifySetup works', async () => {
    try {
      const d = await rq(express().use('/', verifySetup(mockFbVerifyToken)))
        .get('/')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': mockFbVerifyToken,
          'hub.challenge': mockFbChallenge,
        })
        .expect(200);

      expect(d.text).toEqual(mockFbChallenge);
    } catch (e) {
      throw e;
    }
  });

});
