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
      .post(uri => /^\/me\/messenger_profile/i.test(uri))
      .reply((uri, reqBody: any) => {
        const fieldsKeys = Object.keys(reqBody || {});
        const fieldsRe = new RegExp([
          'GET_STARTED',
          'PERSISTENT_MENU',
          'TARGET_AUDIENCE',
          'WHITELISTED_DOMAINS',
          'GREETING',
          'ACCOUNT_LINKING_URL',
          'PAYMENT_SETTINGS',
          'HOME_URL',
        ].join('|'), 'i');

        if (
          !fieldsKeys.length
            || reqBody[fieldsKeys[0]] == null
            || !(fieldsKeys.every(n => fieldsRe.test(n)))
        ) {
          return [400, {
            ...expected.messengerProfile.set.requiresOneOf,
          }];
        }

        /** NOTE: Simple test on `get_started.payload` */
        if (/^get_started/i.test(fieldsKeys[0])) {
          const getStartedPayload = reqBody.get_started && reqBody.get_started.payload;
          const invalidKey = Object.keys(reqBody.get_started || {})
            .find(n => n !== 'payload');

          if (typeof invalidKey !== 'undefined') {
            if (
              reqBody.get_started[invalidKey] == null
                || (typeof getStartedPayload === 'string' && getStartedPayload.length > 0)
            ) {
              return [400, {
                ...expected.messengerProfile.set.invalidKeys,
              }];
            }

            return [400, {
              ...expected.messengerProfile.set.missingGetStartedPayload,
            }];
          }

          return [200, {
            ...expected.messengerProfile.set.setSuccessfully,
          }];
        }

        return [500, {
          error: {
            message: `No match for ${uri} with request body ${JSON.stringify(reqBody)}`,
          },
        }];
      });

    nock(url)
      .get(uri => /^\/me\/messenger_profile/i.test(uri))
      .reply((uri) => {
        const { fields } = getReqQuery(uri);

        if (/^\*+/i.test(fields)) {
          return [400, {
            ...expected.messengerProfile.get.syntaxError,
          }];
        }

        return [200, {
          ...expected.messengerProfile.get.getSuccessfully,
        }];
      });

    nock(url)
      .delete(uri => /^\/me\/messenger_profile/i.test(uri))
      .reply((uri, reqBody: any) => {
        const { fields } = reqBody;

        if (fields == null) {
          return [400, {
            ...expected.messengerProfile.delete.missingFields,
          }];
        }

        if (!Array.isArray(fields) || !fields.length) {
          return [400, {
            ...expected.messengerProfile.delete.emptyFields,
          }];
        }

        const fieldsRe = new RegExp([
          'GET_STARTED',
          'PERSISTENT_MENU',
          'TARGET_AUDIENCE',
          'WHITELISTED_DOMAINS',
          'GREETING',
          'ACCOUNT_LINKING_URL',
          'PAYMENT_SETTINGS',
          'HOME_URL',
        ].join('|'), 'i');

        if (fields.length > 0) {
          if (!(fields.every(n => fieldsRe.test(n)))) {
            return [400, {
              ...expected.messengerProfile.delete.fieldsMustBeOneOf,
            }];
          }

          return [200, {
            ...expected.messengerProfile.delete.deletedSuccessfully,
          }];
        }

        return [500, {
          error: {
            message: `No match for ${uri} with request body ${JSON.stringify(reqBody)}`,
          },
        }];
      });

    nock(url)
      .post(uri => /^\/me\/messenger_codes/i.test(uri))
      .reply((uri, reqBody: any) => {
        const {
          type,
          data,
          image_size,
        } = reqBody;

        if (/^standard/i.test(type)) {
          if (/^abc\+=\*/.test(data && data.ref)) {
            return [500, {
              ...expected.messengerCode.unknownError,
            }];
          }

          if (image_size < 100 || image_size > 2000) {
            return [400, {
              ...expected.messengerCode.invalidImageSize,
            }];
          }

          return [200, {
            ...expected.messengerCode.codedSuccessfully,
          }];
        }

        return [500, {
          error: {
            message: `No match for ${uri} with request body ${JSON.stringify(reqBody)}`,
          },
        }];
      });

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
                  ? { ...expected.domainWhitelisting.whitelistedSuccessfully }
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
