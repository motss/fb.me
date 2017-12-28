// @ts-check

/** Import typings */
import { TestConfig } from '../test-config';

/** Import project dependencies */
import nock from 'nock';
import querystring from 'querystring';

/** Import other modules */
import fbId from './fb-id';

export async function meMessages(
  config: TestConfig
) {
  const {
    fbGraphUrl,
  } = config;

  try {
    nock(fbGraphUrl)
      .post('/me/messages')
      .query({ access_token: /^(ok|bad)/i })
      .reply(function (_, rb) {
        const {
          recipient,
        } = JSON.parse(rb);

        if (typeof recipient.id === 'undefined') {
          return [
            400,
            'recipient[id] is undefined',
          ];
        }

        const rs = /^ok/i.test(this.req.access_token) ? 200 : 400;

        return [
          rs, {
            status: rs,
            recipient: recipient.id,
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
          access_token, /** @type {string} */
        } = querystring.parse<{
          access_token: string;
        }>(uri.replace(/.+\?(.+)$/i, '$1'));

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

export async function locky(config) {
  try {
    console.info('Locky started');

    await testFetchAsJson(config);
    await meMessages(config);
  } catch (e) {
    throw e;
  }
}

export default locky;
