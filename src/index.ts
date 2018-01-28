// @ts-check

export interface MessageflowHandlers {
  onMessage?(sender: FacebookEventId, text: string): Promise<any>;
  onQuickReply?(sender: FacebookEventId, quickReply: MessagePayload): Promise<any>;
  onPostback?(sender: FacebookEventId, postback: FacebookPostbackEventPostback): Promise<any>;
}
export declare interface MessageflowParams extends MessageflowHandlers {
  fetchTimeout: number;

  pageId: string;
  appId: string;
  graphUrl: string;
  verifyToken: string;
  pageAccessToken: string;
  notificationType: string;
  typingDelay: number;
}
export declare interface MessageflowConfig extends MessageflowHandlers {
  appFetchTimeout: number;

  fbPageId: string;
  fbAppId: string;
  fbGraphUrl: string;
  fbVerifyToken: string;
  fbPageAccessToken: string;
  fbNotificationType: string;
  fbTypingDelay: number;
}

/** Import typings */
import { MessagePayload } from './handle-receive-message';
import { FacebookPostbackEventPostback } from './handle-receive-postback';
import { FacebookEventId } from './handle-webhook';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import handleWebhook from './handle-webhook';
import verifySetup from './verify-setup';

export function messageflow({
  fetchTimeout,

  verifyToken,
  pageId,
  appId,
  graphUrl,
  notificationType,
  pageAccessToken,
  typingDelay,

  onMessage,
  onQuickReply,
  onPostback,
}: MessageflowParams): express.Application {
  // TODO: Use whitelister here.
  const config: MessageflowConfig = {
    onMessage,
    onQuickReply,
    onPostback,

    appFetchTimeout: +fetchTimeout,

    fbVerifyToken: verifyToken,
    fbPageId: pageId,
    fbAppId: appId,
    fbGraphUrl: graphUrl,
    fbNotificationType: notificationType,
    fbPageAccessToken: pageAccessToken,
    fbTypingDelay: +typingDelay,
  };

  return express()
    .get('/', verifySetup(verifyToken))
    .post('/', handleWebhook(config));
}

export default messageflow;
