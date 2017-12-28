// @ts-check

/** Import other modules */
import fetchAsJsonSpec from './helper/fetch-as-json.spec';
import testConfig from './test-config';
import locky from './util/locky';

beforeEach(async () => {
  try {
    return await locky(testConfig);
  } catch (e) {
    throw e;
  }
});

describe('unit tests', async () => {
  try {
    await fetchAsJsonSpec(testConfig);
  } catch (e) {
    throw e;
  }
});
