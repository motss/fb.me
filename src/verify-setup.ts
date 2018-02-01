// @ts-check

/** Import project dependencies */
import express from 'express';

export async function getVerifySetup(
  verifyToken: string,
  req: express.Request,
  res: express.Response
): Promise<express.Response> {
  try {
    const reqQuery = req.query;
    const hubVerifyToken = reqQuery['hub.verify_token'];
    const hubMode = reqQuery['hub.mode'];
    const hubChallenge = reqQuery['hub.challenge'];

    if (hubMode == null) {
      throw new TypeError('Parameter hub.mode is missing');
    }

    if (hubVerifyToken == null) {
      throw new TypeError('Parameter hub.verify_token is missing');
    }

    if (hubChallenge == null) {
      throw new TypeError('Parameter hub.challenge is missing');
    }

    if (/^subscribe/i.test(hubMode) && hubVerifyToken === verifyToken) {
      /** NOTE: WEBHOOK_VERIFIED */
      return res.status(200).send(hubChallenge);
    }

    throw new Error('Forbidden');
  } catch (e) {
    throw e;
  }
}

export function verifySetup(verifyToken: string): express.Router {
  return express.Router({ mergeParams: true })
    .get('/', async (req, res, next) => {
      try {
        if (typeof verifyToken !== 'string' || !verifyToken.length) {
          throw new TypeError('Parameter verifyToken is invalid');
        }

        return await getVerifySetup(verifyToken, req, res);
      } catch (e) {
        return next(e);
      }
    });
}

export default verifySetup;
