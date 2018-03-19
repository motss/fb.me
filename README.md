<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">fb.me</h1>

  <p>Express app for chatbot development with Facebook Messenger</p>
</div>

<hr />

[![NPM][nodei-badge]][nodei-url]

[![Version][version-badge]][version-url]
[![Downloads][downloads-badge]][downloads-url]
[![MIT License][mit-license-badge]][mit-license-url]
[![Code of Conduct][coc-badge]][coc-url]

[![Build Status][travis-badge]][travis-url]
[![NSP Status][nsp-badge]][nsp-url]
[![Dependency Status][daviddm-badge]][daviddm-url]
[![Codecov][codecov-badge]][codecov-url]
[![Coverage Status][coveralls-badge]][coveralls-url]

[![codebeat-badge]][codebeat-url]
[![codacy-badge]][codacy-url]

> This is an [Express][expressjs-url] app for chatbot development on Facebook Messenger that uses Facebook Messenger API, specifically the [Send API][send-api-url] by providing a set of methods and route handlers to better deal with a few common tasks while developing any kind of typical chatbot:

  1. Handling messages (text, or quick replies)
  2. Handling messenger profile of chatbots
  3. Handling postbacks
  4. Setting messenger code for chatbots
  5. Verifying the chatbot setup (verifying webhook and whitelisting domains)

## Table of contents

- [Pre-requisites](#pre-requisites)
- [Setup](#setup)
  - [Install](#install)
  - [Usage](#usage)
    - [Node.js](#nodejs)
    - [Native ES modules or TypeScript](#native-es-modules-or-typescript)
- [API Reference](#api-reference)
  - [MessageflowConfig](#messageflowconfig)
  - [FacebookMessageEvent](#facebookmessageevent)
  - [HandleMessengerCodeResponse](#handlemessengercoderesponse)
  - [messengerCode(appConfig)](#messengercodeappconfig)
  - [verifySetup(verifyToken)](#verifysetupverifytoken)
  - [webhook(appConfig[, options])](#webhookappconfig-options)
  - [handleDomainWhitelisting(url, pageAccessToken[, domains, options])](#handledomainwhitelistingurl-pageaccesstoken-domains-options)
  - [handleMessengerCode(url, pageAccessToken[, ref, imageSize, options])](#handlemessengercodeurl-pageaccesstoken-ref-imagesize-options)
  - [deleteMessengerProfile(url, pageAccessToken, fields[, options])](#deletemessengerprofileurl-pageaccesstoken-fields-options)
  - [getMessengerProfile(url, pageAccessToken, fields[, options])](#getmessengerprofileurl-pageaccesstoken-fields-options)
  - [setMessengerProfile(url, pageAccessToken, body[, options])](#setmessengerprofileurl-pageaccesstoken-body-options)
  - [handleReceiveMessage(appConfig, event[, options])](#handlereceivemessageappconfig-event-options)
  - [handleReceivePostback(appConfig, event[, options])](#handlereceivepostbackappconfig-event-options)
- [License](#license)

## Pre-requisites

- [Node.js][node-js-url] >= 8.9.0
- [NPM][npm-url] >= 5.5.1 ([NPM][npm-url] comes with [Node.js][node-js-url] so there is no need to install separately.)

## Setup

### Install

```sh
# Install via NPM
$ npm install --save fb.me
```

### Usage

```js
// src/on-handlers.ts

export async function onMessageHandler(sender, text) {
  // Handler message text here...
}

export async function onPostbackHandler(sender, postback) {
  // Handler postback payload here...
}

export async function onQuickReplyHandler(sender, quickReply) {
  // Handler quick reply here...
}
```

#### Node.js

```js
// src/server.js

/** Import project dependencies */
const https = require('https');
const express = require('express');
const {
  messageflow,
  handleDomainWhitelisting,
  setMessengerProfile,
} = require('fb.me');

/** Import other modules */
const {
  onMessageHandler,
  onPostbackHandler,
  onQuickReplyHandler,
} = require('./on-handlers');

/** Setting up */
const PORT = process.env.PORT;
const config = {
  appId: '<FB_APP_ID>',
  pageAccessToken: '<FB_PAGE_ACCESS_TOKEN>',
  pageId: '<FB_PAGE_ID>',
  url: '<FB_GRAPH_URL>',
  verifyToken: 'FB_VERIFY_TOKEN',

  fetchTimeout: 599e3,
  notificationType: 'REGULAR',
  typingDelay: 5e2,
  onMessage: onMessageHandler,
  onPostback: onPostbackHandler,
  onQuickReply: onQuickReplyHandler,
};
const options = {
  agent: new https.Agent({ keepAlive: true }),
};
const app = express()
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use('/', messageflow(config, options));

/** NOTE: Custom error handling */
app.use((err, req, res, next) => {
  console.error('🚨 Handle error', err);

  return res.send(err instanceof Error ? err.message : err);
});

app.listen(PORT, async () => {
    /** NOTE: Set domain whitelisting on server boots up */
    await handleDomainWhitelisting({
      url: config.url,
      pageAccessToken: config.pageAccessToken,
      domains: [
        'https://should-whitelist-url.com',
      ],
    });

    /** NOTE: Setup messenger profile */
    await setMessengerProfile({
      url: config.url,
      pageAccessToken: config.pageAccessToken,
      body: {
        get_started: {
          payload: 'FACEBOOK_WELCOME',
        },
      },
    });

    console.info(`@ Express server running at port ${PORT}...`;
  });
```

#### Native ES modules or TypeScript

```ts
// src/server.ts

// @ts-check

/** Import project dependencies */
import https from 'https';
import express from 'express';
import messageflow from 'fb.me';
import handleMessengerProfile from 'fb.me/handle-messenger-profile';
import handleDomainWhitelisting from 'fb.me/handle-domain-whitelisting';

/** Import other modules */
import {
  onMessageHandler,
  onPostbackHandler,
  onQuickReplyHandler,
} from './on-handlers';

/** Setting up */
const PORT = process.env.PORT;
const config = {
  appId: '<FB_APP_ID>',
  pageAccessToken: '<FB_PAGE_ACCESS_TOKEN>',
  pageId: '<FB_PAGE_ID>',
  url: '<FB_GRAPH_URL>',
  verifyToken: 'FB_VERIFY_TOKEN',

  fetchTimeout: 599e3,
  notificationType: 'REGULAR',
  typingDelay: 5e2,
  onMessage: onMessageHandler,
  onPostback: onPostbackHandler,
  onQuickReply: onQuickReplyHandler,
};
const options = {
  agent: new https.Agent({ keepAlive: true }),
};
const app = express()
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use('/', messageflow(config, options));

/** NOTE: Custom error handling */
app.use((err, req, res, next) => {
  console.error('🚨 Handle error', err);

  return res.send(err instanceof Error ? err.message : err);
});

app.listen(PORT, async () => {
    /** NOTE: Set domain whitelisting on server boots up */
    await handleDomainWhitelisting({
      url: config.url,
      pageAccessToken: config.pageAccessToken,
      domains: [
        'https://should-whitelist-url.com',
      ],
    });

    /** NOTE: Setup messenger profile */
    await handleMessengerProfile.set({
      url: config.url,
      pageAccessToken: config.pageAccessToken,
      body: {
        get_started: {
          payload: 'FACEBOOK_WELCOME',
        },
      },
    });

    console.info(`@ Express server running at port ${PORT}...`;
  });
```

## API Reference

### MessageflowConfig

- `appId` <[string][string-mdn-url]> Facebook Application ID.
- `pageAccessToken` <[string][string-mdn-url]> Facebook page access token.
- `pageId` <[string][string-mdn-url]> Facebook Page ID.
- `url` <[string][string-mdn-url]> Facebook Graph URL, e.g. `https://graph.facebook.com/v2.11`
- `verifyToken` <[string][string-mdn-url]> Facebook verify token.
- `fetchTimeout` <[number][number-mdn-url]> Optional timeout for HTTP requests, e.g. `599e3`
- `notificationType` <[string][string-mdn-url]> Optional notification type. Possible values: `NO_PUSH`, `REGULAR`, `SILENT_PUSH`.
- `typingDelay` <[number][number-mdn-url]> Optional delay in between messages.

### FacebookMessageEvent

- `message` <[Object][object-mdn-url]> Message object.
  - `mid` <[string][string-mdn-url]> Message ID.
  - `seq` <[string][string-mdn-url]> Sequence number.
  - `quick_reply` <[Object][object-mdn-url]> Optional custom data provided by the sending app. _A `quick_reply` payload is only provided with a text message when the user tap on a [Quick Replies][quick-replies-url] button._
    - `payload` <[string][string-mdn-url]> Custom data provided by the app.
  - `attachment` <[Object][object-mdn-url]> Optional array containing attachment data.
    - `type` <[string][string-mdn-url]> `audio`, `fallback`, `file`, `image`, `location` or `video`.
    - `payload` <[Object][object-mdn-url]> `multimedia` or `location` payload.
      - `url` <[string][string-mdn-url]> URL of the file. _A `url` payload is only provided with a `multimedia` payload._
      - `coordinates` <[Object][object-mdn-url]> Coordinates of a location. _A `coordinates` payload is only provided with a `location` payload._
        - `lat` <[number][number-mdn-url]> Latitude.
        - `long` <[number][number-mdn-url]> Longitude.
  - `text` <[string][string-mdn-url]> Optional text of the message. _A `text` is only provided when the event is a text message event._

### HandleMessengerCodeResponse

- `uri` <[string][string-mdn-url]> URL to the generated messenger code.

___

### messengerCode(appConfig)

- `appConfig` <[MessageflowConfig][messageflowconfig-url]> Application configuration.
- returns: `express.Router` an [Express][expressjs-url] router which contains a HTTP GET route. The route handler returns a promise which resolves with a successful response in the type of [HandleMessengerCodeResponse][handlemessengercoderesponse-url] that contains the URL to the image of the generated messenger code.

### verifySetup(verifyToken)

- `verifyToken` <[string][string-mdn-url]> Facebook verify token.
- returns: `express.Router` an [Express][expressjs-url] router which contains a HTTP GET route. The route handler sends the `hub.challenge` token from the payload sent by Facebook HTTP server to verify the webhook setup.

### webhook(appConfig[, options])

- `appConfig` <[MessageflowConfig][messageflowconfig-url]> Application configuration.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.
- returns: `express.Router` an [Express][expressjs-url] router which contains a HTTP POST route. The route handle will forward the correct message based on its message type to the corresponding event handler to do more stuff on the received message. A `message` message will be forwarded to the [handleReceiveMessage][handlereceivemessageappconfig-event-options-url] method that needs to be defined by the user in the `appConfig` whereas a `postback` message will handled by the [handleReceivePostback][handlereceivepostbackappconfig-event-options-url] method.

### handleDomainWhitelisting(url, pageAccessToken[, domains, options])

- `url` <[string][string-mdn-url]> Facebook Graph URL.
- `pageAccessToken` <[string][string-mdn-url]> Facebook page access token.
- `domains` <[string][string-mdn-url]|[Array][array-mdn-url]&lt;[string][string-mdn-url]&gt;> Optional domain string or a list of domains to be whitelisted.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.
- returns: <[Promise][promise-mdn-url]&lt;[Object][object-mdn-url]&gt;> Promise which resolves with status of the operation.
  - `result` <[string][string-mdn-url]> If the operation is successful, the value is `Successfully updated whitelisted domains`.

### handleMessengerCode(url, pageAccessToken[, ref, imageSize, options])

- `url` <[string][string-mdn-url]> Facebook Graph URL.
- `pageAccessToken` <[string][string-mdn-url]> Facebook page access token.
- `ref` <[string][string-mdn-url]> Optional `ref` string to pass to the chatbot when it is opened via scanning the code on Messenger. 250 character limit and accepts only these characters: `a-z A-Z 0-9 +/=-.:_`.
- `imageSize` <[string][string-mdn-url]> Optional image size, in pixels. Supported range: 100 - 2000px. Defaults to 1000px.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.
- returns: <[Promise][promise-mdn-url]&lt;[Object][object-mdn-url]&gt;> Promise which resolves with an object that contains the URL to the image of the generated messenger code.
  - `uri` <[string][string-mdn-url]> URL to the image of the generated messenger code.

### deleteMessengerProfile(url, pageAccessToken, fields[, options])

- `url` <[string][string-mdn-url]> Facebook Graph URL.
- `pageAccessToken` <[string][string-mdn-url]> Facebook page access token.
- `fields` <[Array][array-mdn-url]&lt;[string][string-mdn-url]&gt;> A list of [Messenger Profile properties][messenger-profile-api-url] to delete.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.
- returns: <[Promise][promise-mdn-url]&lt;[Object][object-mdn-url]&gt;> Promise which resolves with status of the operation.
  - `result` <[string][string-mdn-url]> If the operation is successful, the value is `success`.

### getMessengerProfile(url, pageAccessToken, fields[, options])

- `url` <[string][string-mdn-url]> Facebook Graph URL.
- `pageAccessToken` <[string][string-mdn-url]> Facebook page access token.
- `fields` <[string][string-mdn-url]|[Array][array-mdn-url]&lt;[string][string-mdn-url]&gt;> A list/ comma-separated list of [Messenger Profile properties][messenger-profile-api-url] to retrieve, e.g. `account_linking_url,persistent_menu,get_started,greeting,whitelisted_domains,payment_settings,target_audience,home_url`
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.
- returns: <[Promise][promise-mdn-url]&lt;[Object][object-mdn-url]&gt;> Promise which resolves with status of the operation.
  - `result` <[string][string-mdn-url]> If the operation is successful, the value is `success`.

### setMessengerProfile(url, pageAccessToken, body[, options])

- `url` <[string][string-mdn-url]> Facebook Graph URL.
- `pageAccessToken` <[string][string-mdn-url]> Facebook page access token.
- `body` <[Object][object-mdn-url]> Set the value of one or more [Messenger Profile properties][messenger-profile-api-url] in the format of `'<PROPERTY_NAME>': '<NEW_PROPERTY_VALUE>'`. Only properties specified in the request body will be overwritten.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.
- returns: <[Promise][promise-mdn-url]&lt;[Object][object-mdn-url]&gt;> Promise which resolves with status of the operation.
  - `result` <[string][string-mdn-url]> If the operation is successful, the value is `success`.

### handleReceiveMessage(appConfig, event[, options])

- `appConfig` <[MessageflowConfig][messageflowconfig-url]> Application configuration.
- `event` <[FacebookMessageEvent][facebookmessageevent-url]> Facebook message event. See [messages Webhook Event Reference][messages-webhook-event-reference-url] for more details.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.
- returns: <[Promise][promise-mdn-url]&lt;`any`&gt;> The method will forward the correct message based on its message type to the corresponding event handler to do more stuff on the received message. A `text` message will be forwarded to the `onMessage` method that needs to be defined by the user in the `appConfig` whereas a `quickReply` message will handled by the `onQuickReply` method.

### handleReceivePostback(appConfig, event[, options])

- `appConfig` <[MessageflowConfig][messageflowconfig-url]> Application configuration.
- `event` <[FacebookMessageEvent][facebookmessageevent-url]> Facebook message event. See [messages Webhook Event Reference][messages-webhook-event-reference-url] for more details.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.
- returns: <[Promise][promise-mdn-url]&lt;`any`&gt;> The method will forward all postback payload to a user-defined `onPostback` method in `appConfig`.

## License

[MIT License](https://motss.mit-license.org/) © Rong Sen Ng

<!-- References -->
[expressjs-url]: https://github.com/expressjs/express
[send-api-url]: https://developers.facebook.com/docs/messenger-platform/reference/send-api
[typescript-url]: https://github.com/Microsoft/TypeScript
[node-js-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[node-releases-url]: https://nodejs.org/en/download/releases
[node-fetch-options-url]: https://github.com/bitinn/node-fetch#fetch-options
[messages-webhook-event-reference-url]: https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages#location_payload
[quick-replies-url]: https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies
[messenger-profile-api-url]: https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api

[messageflowconfig-url]: #messageflowconfig
[handlemessengercoderesponse-url]: #handlemessengercoderesponse
[facebookmessageevent-url]: #facebookmessageevent
[handlereceivemessageappconfig-event-options-url]: #handlereceivemessageappconfig-event-options
[handlereceivepostbackappconfig-event-options-url]: #handlereceivepostbackappconfig-event-options

[array-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

<!-- Badges -->
[nodei-badge]: https://nodei.co/npm/fb.me.png?downloads=true&downloadRank=true&stars=true

[version-badge]: https://img.shields.io/npm/v/fb.me.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/fb.me.svg?style=flat-square
[mit-license-badge]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square

[travis-badge]: https://img.shields.io/travis/motss/fb.me.svg?style=flat-square
[nsp-badge]: https://nodesecurity.io/orgs/motss/projects/a1c57ec8-9c17-4912-932b-f1ff6284e2ae/badge
[daviddm-badge]: https://img.shields.io/david/expressjs/express.svg?style=flat-square
[codecov-badge]: https://codecov.io/gh/motss/fb.me/branch/master/graph/badge.svg
[coveralls-badge]: https://coveralls.io/repos/github/motss/fb.me/badge.svg?branch=master

[codebeat-badge]: https://codebeat.co/badges/eb7e977f-be19-4b56-86ea-9aa0b6c55072
[codacy-badge]: https://api.codacy.com/project/badge/Grade/831b7b2c78524b77b0378f848a196553

<!-- Links -->
[nodei-url]: https://nodei.co/npm/fb.me

[version-url]: https://npmjs.org/package/fb.me
[downloads-url]: http://www.npmtrends.com/fb.me
[mit-license-url]: https://github.com/motss/fb.me/blob/master/LICENSE
[coc-url]: https://github.com/motss/fb.me/blob/master/CODE_OF_CONDUCT.md

[travis-url]: https://travis-ci.org/motss/fb.me
[nsp-url]: https://nodesecurity.io/orgs/motss/projects/a1c57ec8-9c17-4912-932b-f1ff6284e2ae
[daviddm-url]: https://david-dm.org/motss/fb.me
[codecov-url]: https://codecov.io/gh/motss/fb.me
[coveralls-url]: https://coveralls.io/github/motss/fb.me?branch=master

[codebeat-url]: https://codebeat.co/projects/github-com-motss-fb-me-master
[codacy-url]: https://www.codacy.com/app/motss/fb.me?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/fb.me&amp;utm_campaign=Badge_Grade
