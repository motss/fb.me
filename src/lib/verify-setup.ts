// @ts-check

/** Import project dependencies */
import express from 'express';

export function verifySetup(verifyToken: string): express.Router {
  return express.Router({ mergeParams: true })
    .get('/', async (req, res, next) => {
      try {
        const hubVerifyToken = req.query['hub.verify_token'];

        if (typeof hubVerifyToken === 'undefined') {
          throw new Error('hub.verify_token is missing');
        }

        if (hubVerifyToken === verifyToken) {
          return res.status(200).send(req.query);
        }

        /** NOTE: Send error with HTTP status 200 */
        return res.status(200).send('Error, wrong validation token');
      } catch (e) {
        return next(e);
      }
    });
}

export default verifySetup;
