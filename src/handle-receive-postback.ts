// @ts-check

export declare interface FacebookPostbackEventPostback {
  title: string;
  payload: string;
}
export declare interface FacebookPostbackEvent extends FacebookEvent {
  postback: FacebookPostbackEventPostback;
}

/** Import typings */
import { RequestInit } from 'node-fetch';
import { MessageflowConfig } from './';
import { FacebookEvent } from './handle-webhook';

/** Import other modules */
import sendReadReceipt from '@messageflow/send-as/send-as-read-receipt';

export async function handleReceivePostback(
  appConfig: MessageflowConfig,
  event: FacebookPostbackEvent,
  options: RequestInit = {}
) {
  try {
    const {
      sender,
      postback,
    } = event || {} as FacebookPostbackEvent;

    /**
     * It's good practice to send the user a read receipt so they know
     * the bot has seen the message. This can prevent a user from
     * spamming the bot if the requests take some time to return.
     */
    await sendReadReceipt({
      options,
      url: appConfig.fbGraphUrl,
      recipient: sender,
    });

    return await appConfig.onPostback(sender, postback);
  } catch (e) {
    throw e;
  }
}

export default handleReceivePostback;
