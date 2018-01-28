// @ts-check

export function fbId(
  idLength: number
) {
  try {
    return `1${
      [...Array(idLength - 1)]
        .map(() => Math.floor(Math.random() * 10))
        .join('')
    }`;
  } catch (e) {
    throw e;
  }
}

export default fbId;
