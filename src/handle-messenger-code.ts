// @ts-check

export declare interface HandleMessengerCodeParams {
  url: string;
  pageAccessToken: string;
  ref?: string; /** 250 char limit. Valid char: a-z A-Z 0-9 +/=-.:_ */
  imageSize?: number; /** 100-2000px. Defaults to 1000px */
  options?: RequestInit;
}

/** Import typings */
import { RequestInit } from 'node-fetch';

/** Import project dependencies */
import { fetchAsJson } from 'fetch-as';

export async function handleMessengerCode({
  url,
  pageAccessToken,
  ref,
  imageSize = 1000,
  options = {} as RequestInit,
}: HandleMessengerCodeParams) {
  try {
    if (typeof url !== 'string' || !url.length) {
      throw new TypeError('Parameter url is invalid');
    }

    if (typeof pageAccessToken !== 'string' || !pageAccessToken.length) {
      throw new TypeError('Parameter pageAccessToken is invalid');
    }

    const uri = `${url}/me/messenger_codes?access_token=${pageAccessToken}`;
    const fetchOpts = {
      method: 'POST',
      headers: {
        ...(options.headers || {}),
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        type: 'standard',
        data: { ref },
        image_size: imageSize,
      }),
    };
    const d = await fetchAsJson(uri, fetchOpts);

    /** NOTE: Throw error if failed to set messenger code */
    if (d.status > 399) {
      throw d.error;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default handleMessengerCode;
