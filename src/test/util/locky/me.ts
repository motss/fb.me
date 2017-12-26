// @ts-check

export declare type TypeExpected = string | 'ok' | 'bad';

/** Import typings */
import { FacebookEventId } from '../../../lib/handle-webhook';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import fbId from '../fb-id';

export async function sendReadReceipt(
  expected: TypeExpected,
  recipient: FacebookEventId
) {
  try {
    const {
      id,
    } = recipient || {} as FacebookEventId;

    if (typeof id === 'undefined') {
      throw new TypeError('recipient[id] is undefined');
    }

    return {
      status: expected === 'ok' ? 200 : 400,
      recipient_id: id,
    };
  } catch (e) {
    throw e;
  }
}

export async function getExpectedResponse(
  expected: TypeExpected,
  reqBody
) {
  try {
    const {
      recipient,
      sender_action,
      // messaging_type,
      // notification_type,
    } = reqBody;

    switch (true) {
      case /^mark_seen/i.test(sender_action): {
        return sendReadReceipt(expected, recipient);
      }
      default:
        throw new Error(`Unknown sender action (${sender_action})`);
    }
  } catch (e) {
    throw e;
  }
}

export function messages(): express.Router {
  try {
    return express.Router({ mergeParams: true })
      .post('/messages', async (req, res, next) => {
        try {
          const {
            access_token,
          } = req.query;
          const expected = /^ok/i.test(access_token)
            ? 'ok'
            : 'bad';
          const expectedResponse = await getExpectedResponse(expected, req.body);

          res.status(expectedResponse.status).send(expectedResponse);

          if (global.gc) {
            global.gc();
          }

          return;
        } catch (e) {
          return next(e);
        }
      });
  } catch (e) {
    throw e;
  }
}

export default messages;
