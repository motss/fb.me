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

export function handleWebhook(
  appConfig: MessageflowConfig
): express.Router {
  return express.Router({ mergeParams: true })
    .post('/', async (req, res, next) => {
      try {
        if (!Object.keys(appConfig || {}).length) {
          throw new TypeError('appConfig is invalid');
        }

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
          return await Promise.all(entry.map(async (pageEntry, i) => {
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
            }));
          }));
        }

        /** NOTE: Returns a '404 Not Found' if event is not from a page subscription */
        return res.sendStatus(404);
      } catch (e) {
        /** NOTE: Assuming all are TypeErrors */
        if (e instanceof TypeError && !res.headersSent) {
          res.status(400).send({
            status: 400,
            message: e.message,
          });
        }

        return next(e);
      }
    });
}

export default handleWebhook;
