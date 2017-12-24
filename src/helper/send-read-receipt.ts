// @ts-check

export declare interface SendAsReadReceiptOptions extends AppConfig {
  headers?: {
    [key: string]: any;
  };
}

/** Import typings */
import {
  FacebookEventId,
} from '../lib/handle-webhook';
import { AppConfig } from '../lib/server';

/** Import project dependencies */
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
    } = options;
    const url = `${fbGraphUrl}/me/messages?access_token=${fbPageAccessToken}`;
    const fetchOpts = {
      method: 'POST',
      compress: true,
      timeout: +appFetchTimeout,
      headers: {
        ...(headers || {}),
        'content-type': 'application/json',
      },
      agent: new https.Agent({
        keepAlive: true,
      }),
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
