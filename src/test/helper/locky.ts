// @ts-check

export declare interface NockRequestQuery {
  access_token: string;
}

/** Import typings */
import { TestConfig } from './test-config';

/** Import project dependencies */
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
    nock(url.replace(/^(https?\:\/\/localhost:\d+).+/i, '$1'))
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

    // nock(url)
    //   .post(uri => /^\/me\/messages\?access_token\=(ok|bad).+/i.test(uri))
    //   .reply((uri, rb: any) => {
    //     const {
    //       recipient,
    //     } = rb;
    //     const {
    //       access_token,
    //     } = getReqQuery<NockRequestQuery>(uri);

    //     if ((recipient && recipient.id) == null) {
    //       return [
    //         400,
    //         {
    //           code: 100,
    //           fbtrace_id: fbId(11),
    //           message: '(#100) The parameter recipient is required',
    //           type: 'OAuthException',
    //         },
    //       ];
    //     }

    //     const isOK = /^ok/i.test(access_token);
    //     const rs = isOK ? 200 : 400;

    //     return [
    //       rs, {
    //         recipient_id: recipient.id,
    //       },
    //     ];
    //   });
  } catch (e) {
    throw e;
  }
}

// export async function testFetchAsJson(
//   config: TestConfig
// ) {
//   const {
//     url,
//   } = config;

//   try {
//     nock(url)
//       .get(uri => /^\/fetchy\?access_token\=(ok|bad).+/i.test(uri))
//       .reply((uri) => {
//         const {
//           access_token,
//         } = getReqQuery<NockRequestQuery>(uri);

//         const isOK = /^ok/i.test(access_token);
//         const rs = isOK ? 200 : 400;

//         return [
//           rs, {
//             status: rs,
//             message: isOK ? 'OK' : 'Bad',
//           },
//         ];
//       });
//   } catch (e) {
//     throw e;
//   }
// }

export async function closeLocky() {
  try {
    return nock.cleanAll();
  } catch (e) {
    throw e;
  }
}

export async function locky(config) {
  try {
    // await testFetchAsJson(config);
    await meMessages(config);
  } catch (e) {
    throw e;
  }
}

export default locky;
