// @ts-check

export declare interface NockRequestQuery {
  access_token: string;
}

/** Import typings */
import { TestConfig } from './test-config';

/** Import project dependencies */
import isUrl from 'is-url-superb';
import nock from 'nock';

/** Import other modules */
import * as expected from './expected';
import fbId from './fb-id';
import getReqQuery from './get-req-query';

export async function meMessages(
  config: TestConfig
) {
  const {
    url,
  } = config;
  const recipientId = fbId(15);

  try {
    nock(url)
      .post(uri => /^\/me\/thread_settings/i.test(uri))
      .reply((uri, reqBody: any) => {
        const {
          setting_type,
          domain_action_type,
          whitelisted_domains,
        } = reqBody;

        if (/^domain_whitelisting/i.test(setting_type)) {
          if (/^add/i.test(domain_action_type)) {
            if (Array.isArray(whitelisted_domains)) {
              const allValidUrls = whitelisted_domains.every(dmn => isUrl(dmn));

              return [allValidUrls ? 200 : 500, {
                ...(
                  allValidUrls
                  ? { result: 'Successfully updated whitelisted domains' }
                  : { ...expected.domainWhitelisting.invalidURL }
                ),
              }];
            }
          }
        }

        return [500, {
          error: {
            message: `No match for ${uri} with request body ${JSON.stringify(reqBody)}`,
          },
        }];
      });

    nock(url)
      .post(uri => /^\/me\/messages/i.test(uri))
      .reply((uri, reqBody: any) => {
        const {
          sender_action,
        } = reqBody;
        const {
          access_token,
        } = getReqQuery<NockRequestQuery>(uri);

        if (/^ok/i.test(access_token)) {
          if (/^typing/i.test(sender_action)) {
            return [200, { recipient_id: recipientId }];
          }

          if (/^mark_seen/i.test(sender_action)) {
            return [200, {
              ...expected.successMessageId,
              recipient_id: recipientId,
            }];
          }
        }

        return [500, {
          error: {
            message: `No match for ${JSON.stringify(reqBody)}`,
          },
        }];
      });
  } catch (e) {
    throw e;
  }
}

export async function closeLocky() {
  try {
    return nock.cleanAll();
  } catch (e) {
    throw e;
  }
}

export async function locky(config) {
  try {
    await meMessages(config);
  } catch (e) {
    throw e;
  }
}

export default locky;
