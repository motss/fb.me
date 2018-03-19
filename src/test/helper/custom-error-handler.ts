// @ts-check

function returnErrorStatus(err) {
  switch (true) {
    case err instanceof TypeError: {
      return 400;
    }
    case err instanceof Error && /^unknown object/i.test(err.message):
    case /^not found/i.test(err.message): {
      return 404;
    }
    case /^forbidden/i.test(err.message): {
      return 403;
    }
    default: {
      return 500;
    }
  }
}

export function customErrorHandler(err, _, res, __) {
  const errStatus = returnErrorStatus(err);

  // console.error('🚨 err', err);

  return res
    .status(errStatus)
    .send({
      error: err instanceof Error
        ? { message: err.message }
        : err,
    });
}

export default customErrorHandler;
