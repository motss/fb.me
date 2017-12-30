// @ts-check

export declare interface NockRequestQuery {
  access_token: string;
}

/** Import typings */
import { TestConfig } from '../test-config';

/** Import project dependencies */
import nock from 'nock';

/** Import other modules */
import getReqQuery from './get-req-query';

export async function meMessages(
  config: TestConfig
) {
  const {
    fbGraphUrl,
  } = config;

  try {
    nock(fbGraphUrl)
      .post(uri => /^\/me\/messages\?access_token\=(ok|bad).+/i.test(uri))
      .reply((uri, rb: any) => {
        const {
          recipient,
        } = rb;
        const {
          access_token,
        } = getReqQuery<NockRequestQuery>(uri);

        if (typeof (recipient && recipient.id) === 'undefined') {
          return [
            400,
            {
              status: 400,
              message: 'recipient[id] is undefined',
            },
          ];
        }

        const isOK = /^ok/i.test(access_token);
        const rs = isOK ? 200 : 400;

        return [
          rs, {
            status: rs,
            recipient_id: recipient.id,
          },
        ];
      });
  } catch (e) {
    throw e;
  }
}

export async function testFetchAsJson(
  config: TestConfig
) {
  const {
    fbGraphUrl,
  } = config;

  try {
    nock(fbGraphUrl)
      .get(uri => /^\/fetchy\?access_token\=(ok|bad).+/i.test(uri))
      .reply((uri) => {
        const {
          access_token,
        } = getReqQuery<NockRequestQuery>(uri);

        const isOK = /^ok/i.test(access_token);
        const rs = isOK ? 200 : 400;

        return [
          rs, {
            status: rs,
            message: isOK ? 'OK' : 'Bad',
          },
        ];
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
    await testFetchAsJson(config);
    await meMessages(config);
  } catch (e) {
    throw e;
  }
}

export default locky;
