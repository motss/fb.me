// @ts-check

export declare interface MessengerProfileParams {
  url: string;
  pageAccessToken: string;
  options?: RequestInit;
}
export declare interface SetMessengerProfileParams extends MessengerProfileParams {
  body: { [key: string]: string; };
}
export declare interface GetMessengerProfileParams extends MessengerProfileParams {
  fields: string;
}
export declare interface DeleteMessengerProfileParams extends MessengerProfileParams {
  fields: { [key: string]: any };
}

/** Import typings */
import { RequestInit } from 'node-fetch';

/** Import project dependencies */
import { fetchAsJson } from 'fetch-as';

export async function setMessengerProfile({
  url,
  pageAccessToken,
  body,
  options = {} as RequestInit,
}: SetMessengerProfileParams) {
  try {
    const uri = `${url}/me/messenger_profile?access_token=${pageAccessToken}`;
    const fetchOpts = {
      method: 'POST',
      headers: {
        ...(options.headers || {}),
        'content-type': 'application/json',
      },
      body: JSON.stringify({ ...body }),
    };
    const d = await fetchAsJson(uri, fetchOpts);

    /** NOTE: Throw error if failed to set messenger profile */
    if (d.status > 399) {
      throw d.error;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export async function getMessengerProfile({
  url,
  pageAccessToken,
  fields,
  options = {} as RequestInit,
}: GetMessengerProfileParams) {
  try {
    const uri = `${url}/me/messenger_profile?access_token=${pageAccessToken}&fields=${fields}`;
    const fetchOpts = {
      method: 'GET',
      headers: {
        ...(options.headers || {}),
      },
    };
    const d = await fetchAsJson(uri, fetchOpts);

    /** NOTE: Throw error if failed to set messenger profile */
    if (d.status > 399) {
      throw d.error;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export async function deleteMessengerProfile({
  url,
  pageAccessToken,
  fields,
  options = {} as RequestInit,
}: DeleteMessengerProfileParams) {
  try {
    const uri = `${url}/me/messenger_profile?access_token=${pageAccessToken}&fields=${fields}`;
    const fetchOpts = {
      method: 'DELETE',
      headers: {
        ...(options.headers || {}),
        'content-type': 'application/json',
      },
      body: JSON.stringify({ ...fields }),
    };
    const d = await fetchAsJson(uri, fetchOpts);

    /** NOTE: Throw error if failed to set messenger profile */
    if (d.status > 399) {
      throw d.error;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default {
  set: setMessengerProfile,
  get: getMessengerProfile,
  delete: deleteMessengerProfile,
};
