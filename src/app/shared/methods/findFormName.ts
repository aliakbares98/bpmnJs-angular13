import { FormName } from '@interfaces/global.interfaces';

export function findFormNameBy(formNames: FormName[], type: number) {

  if (formNames) {
    const formNameObj = formNames.find(
      (el: FormName) => el.ObjectTypeCode === type
    );

    return formNameObj?.Name;
  }
  return
}
