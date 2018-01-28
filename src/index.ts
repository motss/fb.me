// @ts-check

export interface MessageflowHandlers {
  onMessage?(sender: FacebookEventId, text: string): Promise<any>;
  onQuickReply?(sender: FacebookEventId, quickReply: MessagePayload): Promise<any>;
  onPostback?(sender: FacebookEventId, postback: FacebookPostbackEventPostback): Promise<any>;
}
export declare interface MessageflowConfig extends MessageflowHandlers {
  appId: string;
  pageAccessToken: string;
  pageId: string;
  url: string;
  verifyToken: string;

  fetchTimeout?: number;
  notificationType?: string;
  typingDelay?: number;
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

export function messageflow(
  config: MessageflowConfig = {} as MessageflowConfig
): express.Application {
  return express()
    .get('/', verifySetup(config.verifyToken))
    .post('/', handleWebhook(config));
}

export default messageflow;
