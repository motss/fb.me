// @ts-check

export declare interface SendAsReadReceiptOptions {
  appFetchTimeout: number;
  fbNotificationType: string | 'NO_PUSH' | 'REGULAR';
  fbGraphUrl: string;
  fbPageAccessToken: string;

  headers?: {
    [key: string]: any;
  };
  agent?: http.Agent | https.Agent;
}

/** Import typings */
import {
  FacebookEventId,
} from '../lib/handle-webhook';

/** Import project dependencies */
import http from 'http';
import https from 'https';

/** Import other modules */
import fetchAsJson from './fetch-as-json';

export async function sendReadReceipt(
  recipient: FacebookEventId,
  options: SendAsReadReceiptOptions
) {
  try {
    const {
      appFetchTimeout,
      fbNotificationType,
      fbGraphUrl,
      fbPageAccessToken,

      headers,
      agent,
    } = options;
    const url = `${fbGraphUrl}/me/messages?access_token=${fbPageAccessToken}`;
    const fetchOpts = {
      agent,
      method: 'POST',
      compress: true,
      timeout: +appFetchTimeout,
      headers: {
        ...(headers || {}),
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        recipient,
        messaging_type: 'RESPONSE',
        sender_action: 'mark_seen',
        notification_type: fbNotificationType,
      }),
    };
    const d = await fetchAsJson(url, fetchOpts);

    if (d.status > 399) {
      console.warn('[sendReadReceipt] Unable to send read receipt', d.data);
    }

    return d;
  } catch (e) {
    throw e;
  }
}

export default sendReadReceipt;
