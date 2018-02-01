// @ts-check

export interface MessageflowHandlers {
  onMessage?<T>(sender: FacebookEventId, text: string): Promise<T>;
  onQuickReply?<T>(sender: FacebookEventId, quickReply: MessagePayload): Promise<T>;
  onPostback?<T>(sender: FacebookEventId, postback: FacebookPostbackEventPostback): Promise<T>;
}
export type NotificationType = 'NO_PUSH' | 'REGULAR' | 'SILENT_PUSH';
export declare interface MessageflowConfig extends MessageflowHandlers {
  appId: string;
  pageAccessToken: string;
  pageId: string;
  url: string;
  verifyToken: string;

  fetchTimeout?: number;
  notificationType?: NotificationType;
  typingDelay?: number;
}

/** Import typings */
import { RequestInit } from 'node-fetch';
import { MessagePayload } from './handle-receive-message';
import { FacebookPostbackEventPostback } from './handle-receive-postback';
import { FacebookEventId } from './webhook';

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import messengerCode from './messenger-code';
import verifySetup from './verify-setup';
import webhook from './webhook';

export function messageflow(
  config: MessageflowConfig = {} as MessageflowConfig,
  options?: RequestInit
): express.Application {
  return express()
    .use('/messenger-code', messengerCode(config))
    .use('/', verifySetup(config.verifyToken))
    .use('/', webhook(config, options));
}

export * from './handle-domain-whitelisting';
export * from './handle-messenger-code';
export * from './handle-messenger-profile';
export * from './handle-receive-message';
export * from './handle-receive-postback';
export * from './messenger-code';
export * from './verify-setup';
export * from './webhook';

export default messageflow;
