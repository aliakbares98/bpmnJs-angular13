export function setLocalItemBy(localName: string = '', localKey: string = '') {
  let result = localName;
  if (localName) {
    sessionStorage.setItem(localKey, localName);
  } else {
    const localResult = sessionStorage.getItem(localKey);
    if (localResult) {
      result = localResult;
    }
  }

  return result;
}
