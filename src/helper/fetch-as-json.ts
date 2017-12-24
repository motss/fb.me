// @ts-check

/** Import typings */
import { RequestInit } from 'node-fetch';

/** Import project dependencies */
import fetch from 'make-fetch-happen';

export async function fetchAsJson(
  url: string,
  opts: RequestInit
) {
  try {
    const r = await fetch(url, opts);
    const hs = r.status;
    const d = await r.json();

    return {
      status: hs,
      data: (hs >= 399 ? d.error : d.data) || d,
    };
  } catch (e) {
    throw e;
  }
}

export default fetchAsJson;
