// @ts-check

export declare interface MessagePayload {
  payload: string;
}
export declare interface MessageAttachments {
  [key: string]: any;
}
export declare interface FacebookMessageEventMessage {
  mid: string;
  seq: number;
  quick_reply?: MessagePayload;
  attachements?: MessageAttachments;
  text: string;
}
export declare interface FacebookMessageEvent extends FacebookEvent {
  message: FacebookMessageEventMessage;
}

/** Import typings */
import { FacebookEvent } from './handle-webhook';
import { AppConfig } from './server';

/** Import other modules */
import sendReadReceipt from '../helper/send-read-receipt';

export async function handleReceiveMessage(
  appConfig: AppConfig,
  event: FacebookMessageEvent
) {
  try {
    const {
      sender,
      message,
    } = event || {} as FacebookMessageEvent;

    /**
     * It's good practice to send the user a read receipt so they know
     * the bot has seen the message. This can prevent a user from
     * spamming the bot if the requests take some time to return.
     */
    await sendReadReceipt(sender, appConfig);

    return typeof message.quick_reply !== 'undefined'
      ? await appConfig.onQuickReply(sender, message.quick_reply)
      : await appConfig.onMessage(sender, message.text);
  } catch (e) {
    throw e;
  }
}

export default handleReceiveMessage;