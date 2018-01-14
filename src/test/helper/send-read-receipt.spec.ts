// @ts-check

/** Import typings */
import { FacebookEventId } from '../../lib/handle-webhook';

/** Import other modules */
import sendReadReceipt from '../../helper/send-read-receipt';
import { testConfig } from '../test-config';
import fbId from '../util/fb-id';
import locky, { closeLocky } from '../util/locky';

beforeEach(async () => {
  try {
    return await locky(testConfig);
  } catch (e) {
    await closeLocky();

    throw e;
  }
});

afterEach(async () => {
  try {
    return await closeLocky();
  } catch (e) {
    throw e;
  }
});

describe('helper', () => {
  describe('send-read-receipt', async () => {
    // const mockResponse = {
    //   recipient_id: fbId(16),
    // };
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
            recipient_id: expect.stringMatching(/\d{16}/i),
          },
        });
      } catch (e) {
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
            recipient_id: expect.stringMatching(/\d{16}/i),
          },
        });
      } catch (e) {
        throw e;
      }
    });

    test('No recipient error', async () => {
      try {
        expect.assertions(2);

        const d = await sendReadReceipt(null, {
          ...testConfig,
          fbPageAccessToken: 'bad-read-recipient',
        });

        expect(d.status).toBeGreaterThan(399);
        expect(d).toEqual({
          status: 400,
          data: {
            code: 100,
            fbtrace_id: expect.stringMatching(/\d{11}/i),
            message: '(#100) The parameter recipient is required',
            type: 'OAuthException',
          },
        });
      } catch (e) {
        throw e;
      }
    });

    test('Fail request', async () => {
      try {
        expect.assertions(2);

        await sendReadReceipt(null, null);
      } catch (e) {
        expect(e instanceof TypeError).toEqual(true);
        expect(e.message).toEqual('Only absolute URLs are supported');
      }
    });

  });
});
