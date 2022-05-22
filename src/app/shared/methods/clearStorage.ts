export function clearStorage() {
  const storedkeys = Object.keys(localStorage);

  storedkeys.forEach((key) => {
    if (key.includes('hermes_')) {
      localStorage.removeItem(key);
    }
  });
}
