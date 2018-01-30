// @ts-check

export declare interface SetDomainWhitelistingParams {
  url: string;
  pageAccessToken: string;
  domains?: string | string[];
  options?: RequestInit;
}

/** Import typings */
import { RequestInit } from 'node-fetch';

/** Import project dependencies */
import { fetchAsJson } from 'fetch-as';

export async function setDomainWhitelisting({
  url,
  pageAccessToken,
  domains,
  options = {} as RequestInit,
}: SetDomainWhitelistingParams) {
  try {
    if (typeof url !== 'string' || !url.length) {
      throw new TypeError('Parameter url is invalid');
    }

    if (typeof pageAccessToken !== 'string' || !pageAccessToken.length) {
      throw new TypeError('Parameter pageAccessToken is invalid');
    }

    if (typeof domains !== 'string' && !Array.isArray(domains)) {
      throw new TypeError('Parameter domains has to be either a string or an array of strings');
    }

    const uri = `${url}/me/thread_settings?access_token=${pageAccessToken}`;
    const fetchOpts = {
      method: 'POST',
      headers: {
        ...(options.headers || {}),
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        setting_type: 'domain_whitelisting',
        domain_action_type: 'add',
        whitelisted_domains: [
          ...(
            Array.isArray(domains)
              ? domains
              : [domains]
          ),
          'https://www.messenger.com',
          'https://www.facebook.com',
        ],
      }),
    };
    const d = await fetchAsJson(uri, fetchOpts);

    /** NOTE: Throw error if failed to whitelist domains */
    if (d.status > 399) {
      throw d.error;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default setDomainWhitelisting;
