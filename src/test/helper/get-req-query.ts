// @ts-check

/** Import project dependencies */
import querystring from 'querystring';

export function getReqQuery<T>(
  uri: string
) {
  try {
    return querystring.parse<T>((uri || '').replace(/.+\?(.+)$/i, '$1'));
  } catch (e) {
    throw e;
  }
}

export default getReqQuery;
