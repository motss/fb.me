// @ts-check

/** Import typings */
import { MessageflowConfig } from './';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import handleMessengerCode from './handle-messenger-code';

export function messengerCode(
  appConfig: MessageflowConfig
): express.Router {
  return express.Router({ mergeParams: true })
    .get('/', async (req, res, next) => {
      try {
        if (appConfig == null) {
          throw new TypeError('Parameter appConfig is undefined');
        }

        const {
          ref,
          image_size,
        } = req.query;
        const d = await handleMessengerCode({
          ref,
          url: appConfig.url,
          pageAccessToken: appConfig.pageAccessToken,
          imageSize: image_size,
        });

        return res.send(d);
      } catch (e) {
        return next(e);
      }
    });
}

export default messengerCode;
