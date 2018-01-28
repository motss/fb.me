// @ts-check

/** Import typings */
import { MessageflowConfig } from '../../';

/** Import other modules */
import fbId from './fb-id';

export declare interface TestConfig {
  appFetchTimeout: number;

  fbGraphUrl: string;
  fbNotificationType: string;
  fbPageAccessToken: string;
}

export const testConfig: TestConfig = {
  appFetchTimeout: 9e3,

  fbGraphUrl: 'http://localhost:5353',
  fbNotificationType: 'NO_PUSH',
  fbPageAccessToken: 'test-fb-page-access-token',
};
export const testAppConfig: MessageflowConfig = {
  ...testConfig,
  fbAppId: fbId(16),
  fbPageId: 'test-fb-page-id',
  fbTypingDelay: 5e2,
  fbVerifyToken: 'test-fb-verify-token',
};

export default {
  testConfig,
  testAppConfig,
};
