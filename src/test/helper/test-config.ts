// @ts-check

/** Import typings */
import { MessageflowConfig } from '../../';

/** Import other modules */
import fbId from './fb-id';

export declare interface TestConfig {
  fetchTimeout: number;

  url: string;
  notificationType: string;
  pageAccessToken: string;
}

export const testConfig: TestConfig = {
  fetchTimeout: 9e3,

  url: 'http://localhost:5353',
  notificationType: 'NO_PUSH',
  pageAccessToken: 'test-fb-page-access-token',
};
export const testAppConfig: MessageflowConfig = {
  ...testConfig,
  appId: fbId(16),
  pageId: 'test-fb-page-id',
  typingDelay: 5e2,
  verifyToken: 'test-fb-verify-token',
} as MessageflowConfig;

export default {
  testConfig,
  testAppConfig,
};
