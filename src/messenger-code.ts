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
        /**
         * NOTE:
         * Assuming headers are not sent yet,
         * - returns '400 Bad Request' for all TypeErrors.
         * - returns a '404 Not Found' if event is not from a page subscription.
         */
        const rs = e instanceof TypeError ? 400 : 404;

        res.status(rs).send({
          error: {
            message: e.message,
          },
        });

        return next(e);
      }
    });
}

export default messengerCode;
