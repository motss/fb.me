// @ts-check

export declare interface TestConfig {
  appFetchTimeout: number;

  fbGraphUrl: string;
  fbNotificationType: string;
  fbPageAccessToken: string;
}

/** Import typings */
export const testConfig: TestConfig = {
  appFetchTimeout: 9e3,

  fbGraphUrl: 'http://localhost:5353',
  fbNotificationType: 'NO_PUSH',
  fbPageAccessToken: 'test-fb-page-access-token',
};

export default testConfig;
