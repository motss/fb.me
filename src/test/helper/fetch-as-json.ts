// @ts-check

/** Import other modules */
import fetchAsJson from '../../helper/fetch-as-json';

export async function testOKRequest(url, t) {
  try {
    const d = await fetchAsJson(url);

    t.is(d.status, 200);
    t.deepEqual(d.data, {
      status: 'OK',
      message: 'OK',
      debug: true,
      version: '0.1.0',
      from: 'mocky.io',
    });
  } catch (e) {
    t.fail(e);
  }
}

export async function testBadRequest(url, t) {
  try {
    const d = await fetchAsJson(url);

    t.is(d.status, 400);
    t.deepEqual(d.data, {
      status: 'Bad',
      message: 'Bad Request',
      debug: true,
      version: '0.1.0',
      from: 'mocky.io',
    });
  } catch (e) {
    t.fail(e);
  }
}

/** Setting up */
export async function fetchAsJsonSpec(t) {
  try {
    const okMock = 'http://www.mocky.io/v2/5a3fcdcc2e0000901644fea6';
    const badMock = 'http://www.mocky.io/v2/5a3fd2762e0000341744fead';

    t.plan(4);

    await testOKRequest(okMock, t);
    await testBadRequest(badMock, t);
  } catch (e) {
    throw e;
  }
}

export default fetchAsJsonSpec;
