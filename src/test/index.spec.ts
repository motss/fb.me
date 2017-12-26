// @ts-check

/** Import project dependencies */
// import express from 'express';

/** Import other modules */
// import fbMe, {
//   fetchAsJson,
//   server,
// } from '../';

/** Import tests */
import fetchAsJsonSpec from './helper/fetch-as-json.spec';
import sendReadReceiptSpec from './helper/send-read-receipt.spec';
import handleReceiveMessageSpec from './lib/handle-receive-message.spec';
import locky from './util/locky/server';

/** Setting up */
const LOCKY_PORT = 5353;
// const appId = process.env.FB_APP_ID;
// const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN;
// const pageId = process.env.FB_PAGE_ID;
// const verifyToken = process.env.FB_VERIFY_TOKEN;

// TODO: Re-enable test
// describe('tests without locky', async () => {
//   test('fetchAsJson works', async () => {
//     try {
//       await fetchAsJsonSpec();
//     } catch (e) {
//       throw e;
//     }
//   });
// });

describe('tests with locky', async () => {
  let mockServer = null;

  beforeAll(async () => {
    mockServer = (await locky())
      .listen(LOCKY_PORT, () => {
        console.info(`Locky Express running at port ${LOCKY_PORT}...`);
      });

    return mockServer;
  });

  afterAll(() => {
    console.info('Closing Locky Express...');

    return mockServer.close(() => {
      console.info('Locky Express shut down!');
    });
  });

  // TODO: Re-enable test
  // test('sendReadReceipt works', async () => {
  //   try {
  //     await sendReadReceiptSpec();
  //   } catch (e) {
  //     throw e;
  //   }
  // });

  test('handleReceiveMessage works', async () => {
    try {
      await handleReceiveMessageSpec();
    } catch (e) {
      throw e;
    }
  });
});

// test('server works', async (t) => {
//   try {
//     const app = express();

//     app.enable('trust proxy');
//     app.use('/webhook', fbMe({
//       appId,
//       pageAccessToken,
//       pageId,
//       verifyToken,

//       fetchTimeout: 599e3,
//       graphUrl: 'https://graph.facebook.com/2.11',
//       notificationType: 'NO_PUSH',
//       typingDelay: 5e2,

//       onMessage: async (sender, text) => {
//         try {
//           return '';
//         } catch (e) {
//           throw e;
//         }
//       },
//       // onPostback,
//       // onQuickReply,
//     }));

//     console.log('#', {
//       appId,
//       pageAccessToken,
//       pageId,
//       verifyToken,
//     });

//     t.truthy(app);
//   } catch (e) {
//     t.fail(e);
//   }
// });
