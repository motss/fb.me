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
import { FacebookMessageEvent } from './handle-receive-message';
import { FacebookPostbackEvent } from './handle-receive-postback';
import { AppConfig } from './server';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import handleReceiveMessage from './handle-receive-message';
import handleReceivePostback from './handle-receive-postback';

export function handleWebhook(
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
        if (!Object.keys(appConfig || {}).length) {
          throw new TypeError('appConfig is undefined');
        }

        const {
          object,
          entry,
        } = req.body;

        if (object === 'page') {
          if (!Array.isArray(entry) || !entry.length) {
            throw req.body;
          }
          /**
           * Iterate over each entry and there might be multiple if batched.
           */
          const allMessageEvents = await Promise.all(entry.map(async (pageEntry) => {
            if (!Object.keys(pageEntry || {}).length) {
              throw pageEntry;
            } else if (!Array.isArray(pageEntry.messaging) || !pageEntry.messaging.length) {
              throw pageEntry;
            }

            return Promise.all(pageEntry.messaging.map(async (messageEvent) => {
              if (typeof (messageEvent && messageEvent.message) !== 'undefined') {
                return handleReceiveMessage(appConfig, messageEvent);
              }

              if (typeof (messageEvent && messageEvent.postback) !== 'undefined') {
                return handleReceivePostback(appConfig, messageEvent);
              }

              /** NOTE: Throw unknown message event */
              throw messageEvent;
            }));
          }));

          throw allMessageEvents;
        }

        /** NOTE: Throw req[body] with unknown object */
        throw req.body;
      } catch (e) {
        return next(e);
      }
    });
}

export default handleWebhook;
