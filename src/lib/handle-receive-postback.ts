// @ts-check

export declare interface FacebookPostbackEventPostback {
  title: string;
  payload: string;
}
export declare interface FacebookPostbackEvent extends FacebookEvent {
  postback: FacebookPostbackEventPostback;
}

/** Import typings */
import { FacebookEvent } from './handle-webhook';
import { AppConfig } from './server';

/** Import other modules */
import sendReadReceipt from '../helper/send-read-receipt';

export async function handleReceivePostback(
  appConfig: AppConfig,
  event: FacebookPostbackEvent
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
    await sendReadReceipt(sender, appConfig);

    return await appConfig.onPostback(sender, postback);
  } catch (e) {
    throw e;
  }
}

export default handleReceivePostback;
