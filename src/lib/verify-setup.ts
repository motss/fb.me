// @ts-check

/** Import project dependencies */
import express from 'express';

export function verifySetup(verifyToken: string): express.Router {
  return express.Router({ mergeParams: true })
    .get('/', (req, res) => {
      if (typeof verifyToken !== 'string' || !verifyToken.length) {
        throw res
          .status(400)
          .send({
            status: 400,
            message: 'verifyToken is invalid',
          });
      }

      const hubVerifyToken = req.query['hub.verify_token'];

      if (typeof hubVerifyToken === 'undefined') {
        return res
          .status(400) .send({
            status: 400,
            message: 'hub.verify_token is missing',
          });
      }

      if (hubVerifyToken === verifyToken) {
        return res.status(200).send(req.query['hub.challenge']);
      }

      /** NOTE: Send error with HTTP status 200 */
      return res.status(200).send('Error, wrong validation token');
    });
}

export default verifySetup;
