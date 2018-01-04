// @ts-check

export declare interface WebhookResponseEntry {
  messaging: FacebookPostbackEvent[] | FacebookMessageEvent[];
}
export declare interface WebhookResponse {
  object: string | 'page';
  entry: WebhookResponseEntry[];
}
export declare interface FacebookEventId {
  id: string;
}
export declare interface FacebookEvent {
  sender: FacebookEventId;
  recipient: FacebookEventId;
}

/** Import typings */
import { MessageflowConfig } from '../';
import { FacebookMessageEvent } from './handle-receive-message';
import { FacebookPostbackEvent } from './handle-receive-postback';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import handleReceiveMessage from './handle-receive-message';
import handleReceivePostback from './handle-receive-postback';

export async function postWebhook(
  appConfig: MessageflowConfig,
  req: express.Request,
  res: express.Response
): Promise<express.Response | any[]> {
  try {
    const reqBody = req.body;
    const object = reqBody && reqBody.object;
    const entry = reqBody && reqBody.entry;

    if (object == null) {
      throw new TypeError('req[body][object] is missing');
    }

    if (entry == null) {
      throw new TypeError('req[body][entry] is missing');
    }

    if ('page' === object) {
      if (!Array.isArray(entry) || !entry.length) {
        throw new TypeError('req[body][entry] is not an array');
      }

      /**
       * NOTE: Send HTTP status 200 to Facebook within 20 seconds
       * to avoid receiving duplicated messages.
       */
      res.status(200).send('EVENT_RECEIVED');

      /**
       * NOTE: Iterate over each entry and there might be multiple if batched.
       */
      const messageEvents = await Promise.all(entry.map(async (pageEntry, i) => {
        const messaging = pageEntry && pageEntry.messaging;

        if (messaging == null) {
          throw new TypeError(`req[body][entry][${i}][messaging] is missing`);
        }

        if (!Array.isArray(messaging) || !messaging.length) {
          throw new TypeError(`req[body][entry][${i}][messaging] is not an array`);
        }

        return Promise.all(messaging.map(async (messageEvent, ii) => {
          if (messageEvent == null) {
            throw new TypeError(`req[body][entry][${i}][messaging][${ii}] is missing`);
          }

          if ((messageEvent && messageEvent.message) != null) {
            return handleReceiveMessage(appConfig, messageEvent);
          }

          if ((messageEvent && messageEvent.postback) != null) {
            return handleReceivePostback(appConfig, messageEvent);
          }

          return messageEvent;
        }));
      }));

      return Array.prototype.concat.apply([], ...messageEvents);
    }

    throw new Error(`Unknown object (${object})`);
  } catch (e) {
    throw e;
  }
}

export function handleWebhook(
  appConfig: MessageflowConfig
): express.Router {
  return express.Router({ mergeParams: true })
    .post('/', async (req, res, next) => {
      try {
        if (!Object.keys(appConfig || {}).length) {
          throw new TypeError('appConfig is invalid');
        }

        return await postWebhook(appConfig, req, res);
      } catch (e) {
        /**
         * NOTE:
         * Assuming headers are not sent yet,
         * - returns '400 Bad Request' for all TypeErrors.
         * - returns a '404 Not Found' if event is not from a page subscription.
         */
        const rs = e instanceof TypeError ? 400 : 404;
        res.status(rs).send({
          status: rs,
          message: e.message,
        });

        return next(e);
      }
    });
}

export default handleWebhook;
