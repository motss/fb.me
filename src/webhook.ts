// @ts-check

export declare interface FacebookEventId {
  id: string;
}
export declare interface FacebookEvent {
  sender: FacebookEventId;
  recipient: FacebookEventId;
}

/** Import typings */
import { RequestInit } from 'node-fetch';
import { MessageflowConfig } from './';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import handleReceiveMessage from './handle-receive-message';
import handleReceivePostback from './handle-receive-postback';

export async function handleWebhook(
  config: MessageflowConfig,
  options: RequestInit = {} as RequestInit,
  req: express.Request,
  res: express.Response
): Promise<any[]> {
  try {
    const reqBody = req.body;
    const object = reqBody && reqBody.object;
    const entry = reqBody && reqBody.entry;

    if (object == null) {
      throw new TypeError('Parameter req[body][object] is missing');
    }

    if (entry == null) {
      throw new TypeError('Parameter req[body][entry] is missing');
    }

    if ('page' === object) {
      if (!Array.isArray(entry) || !entry.length) {
        throw new TypeError('Parameter req[body][entry] is not an array');
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
          throw new TypeError(`Parameter req[body][entry][${i}][messaging] is missing`);
        }

        if (!Array.isArray(messaging) || !messaging.length) {
          throw new TypeError(`Parameter req[body][entry][${i}][messaging] is not an array`);
        }

        return await Promise.all(messaging.map(async (messageEvent, ii) => {
          if (messageEvent == null) {
            throw new TypeError(`Parameter req[body][entry][${i}][messaging][${ii}] is missing`);
          }

          if ((messageEvent && messageEvent.message) != null) {
            return handleReceiveMessage(config, messageEvent, options);
          }

          if ((messageEvent && messageEvent.postback) != null) {
            return handleReceivePostback(config, messageEvent, options);
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

export function webhook(
  appConfig: MessageflowConfig,
  options?: RequestInit
): express.Router {
  return express.Router({ mergeParams: true })
    .post('/', async (req, res, next) => {
      try {
        if (appConfig == null) {
          throw new TypeError('Parameter appConfig is undefined');
        }

        return await handleWebhook(appConfig, options, req, res);
      } catch (e) {
        return next(e);
      }
    });
}

export default webhook;
