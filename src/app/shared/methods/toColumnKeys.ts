import { ValidationSet } from '../interfaces/global.interfaces';

export function toColumnKeys(validationSet: ValidationSet[], objName: string) {
  const result = validationSet.find(
    (item) => item.ObjectCollectionName === objName
  );

  let columnKes = {};

  if (result != undefined) {
    if (result.ColumnKeyName) columnKes[result.ColumnKeyName] = null;
    if (result.ColumnKeyValue) {
      result.ColumnKeyValue?.split(',').forEach((el) => (columnKes[el] = null));
    }
  }

  return columnKes;
}
