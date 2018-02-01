// @ts-check

/** Import typings */
import { RequestInit } from 'node-fetch';
import { NotificationType } from '..';

/** Import project dependencies */
import express from 'express';
import https from 'https';

/** Import other modules */
import messageflow, {
  handleDomainWhitelisting,
  MessageflowConfig,
} from '..';
import handleMessageProfile from '../handle-messenger-profile';
import onMessage from './on-message';

/** Setting up */
const penv = process.env;
const PORT = penv.PORT;
const isProd = penv.NODE_ENV === 'production';
const config: MessageflowConfig = {
  onMessage,
  appId: penv.FB_APP_ID,
  fetchTimeout: 599e3,
  notificationType: 'NO_PUSH' as NotificationType,
  pageAccessToken: penv.FB_PAGE_ACCESS_TOKEN,
  pageId: penv.FB_PAGE_ID,
  typingDelay: 5e2,
  url: process.env.FB_GRAPH_URL,
  verifyToken: process.env.FB_VERIFY_TOKEN,
  // onPostback,
  // onQuickReply,
};
const options: RequestInit = {
  agent: new https.Agent({
    keepAlive: true,
  }),
};
const app = express();

app.enable('trust proxy');
app.set('json spaces', isProd ? 0 : 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/webhook', messageflow(config, options));

app.use((err, req, res, ___) => {
  console.error('🚨 app err', req.originalUrl, err);

  return res.send(err instanceof Error ? err.message : err);
});

app.listen(PORT, async () => {
  try {
    /**
     * NOTE: Setup before app starts
     * - whitelist domain(s)
     * - setup messenger profile
     */
    await Promise.all([
      handleDomainWhitelisting({
        domains: [penv.HOST],
        pageAccessToken: config.pageAccessToken,
        url: config.url,
      }),
      handleMessageProfile.set({
        url: config.url,
        pageAccessToken: config.pageAccessToken,
        body: {
          get_started: {
            payload: 'FACEBOOK_WELCOME',
          },
        },
      }),
    ]);

    console.info(`${
      isProd ? '👍 Production' : '💥 Development'
    } Express running at port ${PORT}...`);
  } catch (e) {
    console.error('🚨 Error starting app', e);
  }
});
