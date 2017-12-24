// @ts-check

/** Import project dependencies */
import http from 'http';

/** Import other modules */
import fetchAsJson from '../../helper/fetch-as-json';

/** Setting up */
const okData = {
  status: 'OK',
  message: 'OK',
  debug: true,
  version: '0.1.0',
  from: 'mocky.io',
};
const badData = {
  status: 'Bad',
  message: 'Bad Request',
  debug: true,
  version: '0.1.0',
  from: 'mocky.io',
};

export async function testOKRequest(url) {
  try {
    const d = await fetchAsJson(url);

    expect(d.status).toEqual(200);
    expect(d.data).toEqual(okData);
  } catch (e) {
    throw e;
  }
}

export async function testBadRequest(url) {
  try {
    const d = await fetchAsJson(url);

    expect(d.status).toEqual(400);
    expect(d.data).toEqual(badData);
  } catch (e) {
    throw e;
  }
}

export async function testOKRequestWithOpts(url) {
  try {
    const d = await fetchAsJson(url, {
      method: 'GET',
      compress: true,
      timeout: 9e3,
      agent: new http.Agent({ keepAlive: true }),
    });

    expect(d.status).toEqual(200);
    expect(d.data).toEqual(okData);
  } catch (e) {
    throw e;
  }
}

export async function testBadRequestWithOpts(url) {
  try {
    const d = await fetchAsJson(url, {
      method: 'GET',
      compress: true,
      timeout: 9e3,
      agent: new http.Agent({ keepAlive: true }),
    });

    expect(d.status).toEqual(400);
    expect(d.data).toEqual(badData);
  } catch (e) {
    throw e;
  }
}

export async function testFailRequest() {
  try {
    await fetchAsJson('');
  } catch (e) {
    expect(e).toEqual(new TypeError('Only absolute URLs are supported'));
  }
}

/** Setting up */
export async function fetchAsJsonSpec() {
  try {
    const okMock = 'http://www.mocky.io/v2/5a3fcdcc2e0000901644fea6';
    const badMock = 'http://www.mocky.io/v2/5a3fd2762e0000341744fead';

    expect.assertions(9);

    await testOKRequest(okMock);
    await testBadRequest(badMock);

    await testOKRequestWithOpts(okMock);
    await testBadRequestWithOpts(badMock);

    await testFailRequest();
  } catch (e) {
    throw e;
  }
}

export default fetchAsJsonSpec;
