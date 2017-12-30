// @ts-check

export declare interface WebhookResponseEntry {
  messaging: FacebookMessageEvent[] | FacebookPostbackEvent[];
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
import { FacebookMessageEvent } from './handle-receive-message';
import { FacebookPostbackEvent } from './handle-receive-postback';
import { AppConfig } from './server';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import handleReceiveMessage from './handle-receive-message';
import handleReceivePostback from './handle-receive-postback';

export function webhook(
  appConfig: AppConfig
): express.Router {
  return express.Router({ mergeParams: true })
    .post('/', async (req, res, next) => {
      /**
       * NOTE: Send HTTP status 200 to Facebook within 20 seconds
       * to avoid receiving duplicated messages.
       */
      res.sendStatus(200);

      try {
        const {
          object,
          entry,
        } = req.body;

        if (object === 'page') {
          /**
           * Iterate over each entry and there might be multiple if batched.
           */

          if (!Array.isArray(entry) || !entry.length) {
            return entry;
          }

          const allMessageEvents = await Promise.all(entry.map(async (pageEntry) => {
            if (typeof (pageEntry && pageEntry.messaging) === 'undefined') {
              throw pageEntry;
            } else if (!Array.isArray(pageEntry.messaging) || !pageEntry.messaging.length) {
              throw pageEntry;
            }

            return Promise.all(pageEntry.messaging.map(async (messageEvent) => {
              if (typeof messageEvent === 'undefined') {
                throw messageEvent;
              }

              const {
                message,
                postback,
              } = messageEvent;

              if (typeof message !== 'undefined') {
                return handleReceiveMessage(appConfig, messageEvent);
              }

              if (typeof postback !== 'undefined') {
                return handleReceivePostback(appConfig, messageEvent);
              }

              throw messageEvent;
            }));
          }));

          return allMessageEvents;
        }

        /** NOTE: Run explicit GC. */
        if (global.gc) {
          global.gc();
        }

        /** NOTE: Return entire req[body] for debugging */
        return req.body;
      } catch (e) {
        return next(e);
      }
    });
}

export default webhook;
