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
import idx from 'idx';
import pMapSeries from 'p-map-series';

/** Import other modules */
import handleReceiveMessage from './handle-receive-message';
import handleReceivePostback from './handle-receive-postback';

/** Setting up */
const pms = pMapSeries;

export async function handleWebhook(
  config: MessageflowConfig,
  options: RequestInit = {} as RequestInit,
  req: express.Request,
  res: express.Response
): Promise<any[]> {
  try {
    const object = idx(req.body, _ => _.object);
    const entry = idx(req.body, _ => _.entry);

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

      return Array.prototype.concat.apply(
        [],
        ...(
          await pms(
            entry,
            async (pageEntry, i) => {
              try {
                const messaging = idx(pageEntry, _ => _.messaging);

                if (!Array.isArray(messaging) || !messaging.length) {
                  throw new TypeError(
                    `Parameter req[body][entry][${i}][messaging] is not an array`
                  );
                }

                return await pms(
                  messaging,
                  async (messageEvent, ii) => {
                    try {
                      switch (true) {
                        case (messageEvent == null): {
                          throw new TypeError(
                            `Parameter req[body][entry][${i}][messaging][${ii}] is missing`
                          );
                        }
                        case ('message' in messageEvent): {
                          return await handleReceiveMessage(config, messageEvent, options);
                        }
                        case ('postback' in messageEvent): {
                          return await handleReceivePostback(config, messageEvent, options);
                        }
                        // case ('attachment' in messageEvent): {
                        //   return handleReceiveAttachment(config, messageEvent, options);
                        // }
                        default: {
                          throw new Error(
                            `Unknown message event req[body][entry][${i}][messaging][${ii}]`
                          );
                        }
                      }
                    } catch (e) {
                      throw e;
                    }
                  }
                );
              } catch (e) {
                throw e;
              }
            }
          )
        )
      );
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

        console.log(
          '⛑ [POST] webhook',
          await handleWebhook(appConfig, options, req, res)
        );
      } catch (e) {
        return next(e);
      }
    });
}

export default webhook;
