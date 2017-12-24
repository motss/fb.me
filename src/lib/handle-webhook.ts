// @ts-check

export declare interface FacebookEventId {
  id: string;
}
export declare interface FacebookEvent {
  sender: FacebookEventId;
  recipient: FacebookEventId;
}

/** Import typings */
import { AppConfig } from './server';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import handleReceiveMessage from './handle-receive-message';
import handleReceivePostback from './handle-receive-postback';

export function webhook(
  appConfig: AppConfig
): express.Router {
  try {
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

            const allMessageEvents = entry.map(async (pageEntry) => {
              return Promise.all(pageEntry.messaging.map(async (messageEvent) => {
                const {
                  message,
                  postback,
                } = messageEvent;

                switch (true) {
                  case (typeof message !== 'undefined'): {
                    return handleReceiveMessage(appConfig, messageEvent);
                  }
                  case (typeof postback !== 'undefined'): {
                    return handleReceivePostback(appConfig, messageEvent);
                  }
                  default: {
                    throw messageEvent;
                  }
                }
              }));
            });
            const entries = await Promise.all(allMessageEvents);

            return entries;
          }

          /** NOTE: Run explicit GC. */
          if (global.gc) {
            global.gc();
          }

          return void 0;
        } catch (e) {
          return next(e);
        }
      });
  } catch (e) {
    throw e;
  }
}

export default webhook;
