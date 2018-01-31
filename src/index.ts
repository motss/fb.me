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
import { RequestInit } from 'node-fetch';
import { MessagePayload } from './handle-receive-message';
import { FacebookPostbackEventPostback } from './handle-receive-postback';
import { FacebookEventId } from './handle-webhook';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import handleMessengerCode from './handle-messenger-code';
import handleWebhook from './handle-webhook';
import verifySetup from './verify-setup';

export function messageflow(
  config: MessageflowConfig = {} as MessageflowConfig,
  options?: RequestInit
): express.Application {
  return express()
    .use('/messenger-code', handleMessengerCode(config))
    .use('/', verifySetup(config.verifyToken))
    .use('/', handleWebhook(config, options));
}

export * from './handle-messenger-code';
export * from './handle-receive-message';
export * from './handle-receive-postback';
export * from './handle-webhook';
export * from './messenger-profile';
export * from './set-domain-whitelisting';
export * from './set-messenger-code';
export * from './verify-setup';

export default messageflow;
