/* 3F : FromFormFeild */
export function removeComma3F(formRawValue) {
  const rowKeys = Object.keys(formRawValue);

  rowKeys.map((key) => {
    if (
      typeof formRawValue[key] === 'string' &&
      formRawValue[key].includes(',')
    ) {
      formRawValue[key] = formRawValue[key].replace(/,/g, '');
    } else if (typeof formRawValue[key] === 'object') {
      if (formRawValue[key]) removeComma3F(formRawValue[key]);
    } else if (Array.isArray(formRawValue[key])) {
      formRawValue[key].forEach((el) => {
        if (el) {
          removeComma3F(el);
        }
      });
    }
  });

  return formRawValue;
}
