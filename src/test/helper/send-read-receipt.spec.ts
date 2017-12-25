// @ts-check

/** Import typings */
import { SendAsReadReceiptOptions } from '../../helper/send-read-receipt';
import { FacebookEventId } from '../../lib/handle-webhook';

/** Import other modules */
import sendReadReceipt from '../../helper/send-read-receipt';
import fbId from '../util/fb-id';

export async function testOKRequest(
  recipient: FacebookEventId,
  options: SendAsReadReceiptOptions
) {
  try {
    const d = await sendReadReceipt(recipient, options);

    expect(d.status).toEqual(200);
    expect(d.data).toMatchObject({
      status: 200,
      recipient_id: expect.stringMatching(/\d{16}/),
    });
    // expect(d.data).toEqual({
    //   status: 200,
    //   recipient_id: recipient.id,
    // });
  } catch (e) {
    throw e;
  }
}

export async function testBadRequest(
  recipient: FacebookEventId,
  options: SendAsReadReceiptOptions
) {
  try {
    const d = await sendReadReceipt(recipient, options);

    expect(d.status).toEqual(400);
    expect(d.data).toMatchObject({
      status: 400,
      recipient_id: expect.stringMatching(/\d{16}/),
    });
  } catch (e) {
    throw e;
  }
}

export async function testFailRequest(
  recipient: FacebookEventId,
  options: SendAsReadReceiptOptions
) {
  try {
    await sendReadReceipt(recipient, options);
  } catch (e) {
    expect(e).toEqual(new TypeError('Only absolute URLs are supported'));
  }
}

export async function sendReadReceiptSpec() {
  try {
    const recipient: FacebookEventId = {
      id: await fbId(16),
    };
    const okOptions = {
      appFetchTimeout: 9e3,
      fbNotificationType: 'NO_PUSH',
      fbGraphUrl: 'http://localhost:5353',
      fbPageAccessToken: 'ok-page-access-token',

      headers: {
        'content-type': 'application/json',
      },
    };
    const badOptions = {
      appFetchTimeout: 9e3,
      fbNotificationType: 'NO_PUSH',
      fbGraphUrl: 'http://localhost:5353',
      fbPageAccessToken: 'bad-page-access-token',
    };
    const failOptions = {
      appFetchTimeout: 9e3,
      fbNotificationType: 'NO_PUSH',
      fbGraphUrl: '',
      fbPageAccessToken: '',
    };

    expect.assertions(5);

    await testOKRequest(recipient, okOptions);
    await testBadRequest(recipient, badOptions);
    await testFailRequest(recipient, failOptions);
  } catch (e) {
    throw e;
  }
}

export default sendReadReceiptSpec;
