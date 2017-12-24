// @ts-check

/** Import typings */
import { AppConfig } from './server';

/** Import project dependencies */
import express from 'express';

export function verifySetup({
  fbVerifyToken,
}: AppConfig): express.Router {
  try {
    return express.Router({ mergeParams: true })
      .get('/', async (req, res, next) => {
        try {
          if (req.query['hub.verify_token'] === fbVerifyToken) {
            return res.status(200).send(req.query);
          }

          /** NOTE: Send error with HTTP status 200 */
          return res.status(200).send('Error, wrong validation token');
        } catch (e) {
          return next(e);
        }
      });
  } catch (e) {
    throw e;
  }
}

export default verifySetup;
