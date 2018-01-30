export const successMessageId = {
  message_id: 'mid.$cAaIwD89I0sNnyYILOvHmdZcTp7vX',
};

export const domainWhitelisting = {
  invalidURL: {
    error: {
      message: '(#100) whitelisted_domains[0] should represent a valid URL',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'DR7Nio\/PoNN',
    },
  },
  whitelistedSuccessfully: {
    result: 'Successfully updated whitelisted domains',
  },
};
export const messengerCode = {
  unknownError: {
    error: {
      message: 'An unknown error has occurred.',
      type: 'OAuthException',
      code: 1,
      fbtrace_id: 'E74gJloyMeC',
    },
  },
  invalidImageSize: {
    error: {
      message: '(#100) Param image_size must be a number less than or equal to 2000',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'EvP4a8+jN3E',
    },
  },
  codedSuccessfully: {
    // tslint:disable-next-line:max-line-length
    uri: 'https:\/\/scontent.xx.fbcdn.net\/v\/7ug.rss9-0\/87004711_8855003831735348_7642822452403108625_n.png?oh=4mepwjww40szx9u49qtj2rvbv0i3idj2&oe=VDK2YTF3',
  },
};
export const messengerProfile = {
  delete: {
    missingFields: {
      error: {
        message: '(#100) The parameter fields is required',
        type: 'OAuthException',
        code: 100,
        fbtrace_id: 'DLN3XXyvEe1',
      },
    },
    emptyFields: {
      error: {
        message: '(#100) param fields must be non-empty.',
        type: 'OAuthException',
        code: 100,
        fbtrace_id: 'HwbSvwiPYts',
      },
    },
    fieldsMustBeOneOf: {
      error: {
        // tslint:disable-next-line:max-line-length
        message: '(#100) Param fields[0] must be one of {GET_STARTED, PERSISTENT_MENU, TARGET_AUDIENCE, WHITELISTED_DOMAINS, GREETING, ACCOUNT_LINKING_URL, PAYMENT_SETTINGS, HOME_URL}',
        type: 'OAuthException',
        code: 100,
        fbtrace_id: 'DgkUOA9xqa5',
      },
    },
    deletedSuccessfully: {
      result: 'success',
    },
  },
  get: {
    syntaxError: {
      error: {
        message: 'Syntax error \"Expected name.\" at character 0: *****',
        type: 'OAuthException',
        code: 2500,
        fbtrace_id: 'B5UwcGpMJPJ',
      },
    },
    getSuccessfully: {
      data: [],
    },
  },
  set: {
    requiresOneOf: {
      error: {
        // tslint:disable-next-line:max-line-length
        message: '(#100) Requires one of the params: get_started,persistent_menu,target_audience,whitelisted_domains,greeting,account_linking_url,payment_settings,home_url',
        type: 'OAuthException',
        code: 100,
        fbtrace_id: 'DAsa1qzq2IZ',
      },
    },
    invalidKeys: {
      error: {
        message: '(#100) Invalid keys \"payload2\" were found in param \"get_started\".',
        type: 'OAuthException',
        code: 100,
        fbtrace_id: 'HcN4DtJjFbV',
      },
    },
    missingGetStartedPayload: {
      error: {
        message: '(#100) The parameter get_started[payload] is required',
        type: 'OAuthException',
        code: 100,
        fbtrace_id: 'E86WdVj5HGf',
      },
    },
    setSuccessfully: {
      result: 'success',
    },
  },
};
