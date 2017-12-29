// @ts-check

/** Import typings */
import { FacebookEventId } from '../../lib/handle-webhook';

/** Import other modules */
import sendReadReceipt from '../../helper/send-read-receipt';
import testConfig from './test-config';
import fbId from './util/fb-id';
import locky from './util/locky';

beforeEach(async () => {
  try {
    return await locky(testConfig);
  } catch (e) {
    throw e;
  }
});

describe('send-read-receipt', async () => {
  // FIXME: await fbId will destroy the whole test suite!!! Why Jest!
  const recipient: FacebookEventId = {
    id: fbId(16),
  };

  test('OK response', async () => {
    try {
      expect.assertions(2);

      const d = await sendReadReceipt(recipient, {
        ...testConfig,
        fbPageAccessToken: 'ok-read-receipt',
      });

      expect(d.status).toEqual(200);
      expect(d).toEqual({
        status: expect.any(Number),
        data: {
          status: expect.any(Number),
          recipient_id: expect.stringMatching(/\d{16}/i),
        },
      });

      // return d;
    } catch (e) {
      console.log(e);

      throw e;
    }
  });

  test('Bad response', async () => {
    try {
      expect.assertions(2);

      const d = await sendReadReceipt(recipient, {
        ...testConfig,
        fbPageAccessToken: 'bad-read-recipient',
      });

      expect(d.status).toBeGreaterThan(399);
      expect(d).toEqual({
        status: expect.any(Number),
        data: {
          status: expect.any(Number),
          recipient_id: expect.stringMatching(/\d{16}/i),
        },
      });
    } catch (e) {
      throw e;
    }
  });

  test('Fail request', async () => {
    try {
      expect.assertions(2);

      await sendReadReceipt(null, {
        ...testConfig,
        fbGraphUrl: '/fail',
      });
    } catch (e) {
      expect(e instanceof TypeError).toEqual(true);
      expect(e.message).toEqual('Only absolute URLs are supported');
    }
  });
});
