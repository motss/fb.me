// @ts-check

/** Import project dependencies */
import test from 'ava';
import express from 'express';

/** Import other modules */
import fbMe, {
  fetchAsJson,
  server,
} from '../';

/** Import tests */
import fetchAsJsonSpec from './helper/fetch-as-json.spec';

/** Setting up */
const PORT = 5000;
const appId = process.env.FB_APP_ID;
const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN;
const pageId = process.env.FB_PAGE_ID;
const verifyToken = process.env.FB_VERIFY_TOKEN;

test('fetchAsJson works', async (t) => {
  try {
    await fetchAsJsonSpec(t);
  } catch (e) {
    t.fail(e);
  }
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
