// @ts-check

/** Import project dependencies */
import express from 'express';

export function verifySetup(verifyToken: string): express.Router {
  return express.Router({ mergeParams: true })
    .get('/', (req, res, next) => {
      try {
        if (typeof verifyToken !== 'string' || !verifyToken.length) {
          throw new TypeError('verifyToken is invalid');
        }

        const reqQuery = req.query;
        const hubVerifyToken = reqQuery['hub.verify_token'];
        const hubMode = reqQuery['hub.mode'];
        const hubChallenge = reqQuery['hub.challenge'];

        if (hubMode == null) {
          throw new TypeError('hub.mode is missing');
        }

        if (hubVerifyToken == null) {
          throw new TypeError('hub.verify_token is missing');
        }

        if (hubChallenge == null) {
          throw new TypeError('hub.challenge is missing');
        }

        if (/^subscribe/i.test(hubMode) && hubVerifyToken === verifyToken) {
          console.info('WEBHOOK_VERIFIED');

          return res.status(200).send(hubChallenge);
        }

        /** NOTE: Respond with '403 Forbidden' if verify tokens do not match */
        return res.sendStatus(403);
      } catch (e) {
        /** NOTE: Always assume that all are TypeErrors */
        res.status(400).send({
          status: 400,
          message: e.message,
        });

        return next(e);
      }
    });
}

export default verifySetup;
