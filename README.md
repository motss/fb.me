<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">fb.me</h1>

  <p>Express middleware for chatbot development with Facebook Messenger</p>
</div>

<hr />

[![NPM][nodei-badge]][nodei-url]

[![Build Status][travis-badge]][travis-url]
[![Version][version-badge]][version-url]
[![Downloads][downloads-badge]][downloads-url]
[![MIT License][mit-license-badge]][mit-license-url]
[![Dependency Status][daviddm-badge]][daviddm-url]
[![NSP Status][nsp-badge]][nsp-url]

[![Code of Conduct][coc-badge]][coc-url]
[![Codecov][codecov-badge]][codecov-url]
[![Coverage Status][coveralls-badge]][coveralls-url]

[![codebeat-badge]][codebeat-url]
[![codacy-badge]][codacy-url]
[![inch-badge]][inch-url]

> This is a [Express][expressjs-url] based middleware that uses Facebook Messenger API, specifically the [Send API][send-api-url] for developing chatbots on Messenger. This helps in handling a few tasks:

  1. Handling messages (text, or quick replies)
  2. Handling postbacks
  3. Verifying the chatbot setup (verifying webhook and whitelisting domains)

## Table of contents

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

#### Node.js

```js
const greeting = require('fb.me');
```

#### Native ES modules or TypeScript

```ts
import greeting from 'fb.me';
```

## API Reference

### greeting(name)

  - name <[string][string-mdn-url]> Name of the person to greet at.
  - returns: <[Promise][promise-mdn-url]<[string][string-mdn-url]>> Promise which resolves with a greeting message.

### greetingSync(name)

This methods works the same as `greeting(name)` except that this is the synchronous version.

## License

[MIT License](https://motss.mit-license.org/) © Rong Sen Ng



[typescript-url]: https://github.com/Microsoft/TypeScript
[node-js-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[node-releases-url]: https://nodejs.org/en/download/releases
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise



[nodei-badge]: https://nodei.co/npm/fb.me.png?downloads=true&downloadRank=true&stars=true

[travis-badge]: https://img.shields.io/travis/motss/fb.me.svg?style=flat-square

[version-badge]: https://img.shields.io/npm/v/fb.me.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/fb.me.svg?style=flat-square
[mit-license-badge]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[nsp-badge]: https://nodesecurity.io/orgs/motss/projects/a1c57ec8-9c17-4912-932b-f1ff6284e2ae/badge
[daviddm-badge]: https://img.shields.io/david/expressjs/express.svg?style=flat-square

[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[codecov-badge]: https://codecov.io/gh/motss/fb.me/branch/master/graph/badge.svg
[coveralls-badge]: https://coveralls.io/repos/github/motss/fb.me/badge.svg?branch=master

[codebeat-badge]: https://codebeat.co/badges/e486e791-12b7-4198-b834-0fa5bd04e1c3
[codacy-badge]: https://api.codacy.com/project/badge/Grade/a70d1556b4e74711a162c4fd4dbb68a1
[inch-badge]: http://inch-ci.org/github/motss/fb.me.svg?branch=master



[nodei-url]: https://nodei.co/npm/fb.me

[travis-url]: https://travis-ci.org/motss/fb.me
[version-url]: https://npmjs.org/package/fb.me
[downloads-url]: http://www.npmtrends.com/fb.me
[mit-license-url]: https://github.com/motss/fb.me/blob/master/LICENSE
[nsp-url]: https://nodesecurity.io/orgs/motss/projects/a1c57ec8-9c17-4912-932b-f1ff6284e2ae
[daviddm-url]: https://david-dm.org/motss/fb.me

[coc-url]: https://github.com/motss/fb.me/blob/master/CODE_OF_CONDUCT.md
[codecov-url]: https://codecov.io/gh/motss/fb.me
[coveralls-url]: https://coveralls.io/github/motss/fb.me?branch=master

[codebeat-url]: https://codebeat.co/projects/github-com-motss-fb.me-master
[codacy-url]: https://www.codacy.com/app/motss/fb.me?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/fb.me&amp;utm_campaign=Badge_Grade
[inch-url]: http://inch-ci.org/github/motss/fb.me
