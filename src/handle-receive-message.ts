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
  text?: string; /** FIXME: Can this be optional when it's a quick reply? */
}
export declare interface FacebookMessageEvent extends FacebookEvent {
  message: FacebookMessageEventMessage;
}

/** Import typings */
import { RequestInit } from 'node-fetch';
import { MessageflowConfig } from './';
import { FacebookEvent } from './handle-webhook';

/** Import other modules */
import sendAsReadReceipt from '@messageflow/send-as/send-as-read-receipt';

export async function handleReceiveMessage(
  appConfig: MessageflowConfig,
  event: FacebookMessageEvent,
  options: RequestInit = {}
) {
  try {
    const {
      sender,
      message,
    } = event || {} as FacebookMessageEvent;
    const {
      quick_reply,
      text,
    } = message || {} as FacebookMessageEventMessage;
    const hasQuickReply = typeof quick_reply !== 'undefined';
    const hasText = typeof text !== 'undefined';

    /**
     * It's good practice to send the user a read receipt so they know
     * the bot has seen the message. This can prevent a user from
     * spamming the bot if the requests take some time to return.
     */
    await sendAsReadReceipt({
      options,
      url: `${appConfig.url}?access_token=${appConfig.pageAccessToken}`,
      recipient: sender,
    });

    if (!hasQuickReply && !hasText) {
      throw new TypeError('messageEvent is undefined');
    }

    const onMessageHandler = typeof appConfig.onMessage === 'function'
      ? appConfig.onMessage
      : () => { throw new TypeError('onMessage is not a function'); };
    const onQuickReplyHandler = typeof appConfig.onQuickReply === 'function'
      ? appConfig.onQuickReply
      : () => { throw new TypeError('onQuickReply is not a function'); };

    return hasQuickReply
      ? await onQuickReplyHandler(sender, message.quick_reply)
      : await onMessageHandler(sender, message.text);
  } catch (e) {
    throw e;
  }
}

export default handleReceiveMessage;
