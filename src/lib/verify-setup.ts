// @ts-check

/** Import project dependencies */
import express from 'express';

export function verifySetup(verifyToken: string): express.Router {
  return express.Router({ mergeParams: true })
    .get('/', (req, res) => {
      if (typeof verifyToken !== 'string' || !verifyToken.length) {
        return res.status(400).send({
          status: 400,
          message: 'verifyToken is invalid',
        });
      }

      const reqQuery = req.query;
      const hubVerifyToken = reqQuery['hub.verify_token'];
      const hubMode = reqQuery['hub.mode'];
      const hubChallenge = reqQuery['hub.challenge'];

      if (hubMode == null) {
        return res.status(400).send({
          status: 400,
          message: 'hub.mode is missing',
        });
      }

      if (hubVerifyToken == null) {
        return res.status(400).send({
          status: 400,
          message: 'hub.verify_token is missing',
        });
      }

      if (hubChallenge == null) {
        return res.status(400).send({
          status: 400,
          message: 'hub.challenge is missing',
        });
      }

      if (/^subscribe/i.test(hubMode) && hubVerifyToken === verifyToken) {
        console.info('WEBHOOK_VERIFIED');

        return res.status(200).send(hubChallenge);
      }

      /** NOTE: Respond with '403 Forbidden' if verify tokens do not match */
      return res.sendStatus(403);
    });
}

export default verifySetup;
