// @ts-check

/** Import project dependencies */
import crypto from 'crypto';

export function validateRequest(appSecret: string) {
  return async (req, res, next) => {
    if (typeof appSecret !== 'string' || !appSecret.length) {
      throw new TypeError('Param appSecret is not a string');
    }

    const xHubSignature = req.query['x-hub-signature'];

    if (typeof xHubSignature !== 'string' || !xHubSignature.length) {
      /** NOTE: Send HTTP 404 status when req[query][x-hub-signature] is not found */
      return res.status(404).send();
    }

    const reqSignature = `sha1=${
      crypto
        .createHmac('sha1', appSecret)
        .update(JSON.stringify(req.body))
        .digest('hex')
    }`;

    if (reqSignature === xHubSignature) {
      return next();
    }

    /** NOTE: Send HTTP 404 status when the signatures are mismatched */
    return res.status(404).send();
  };
}

export default validateRequest;
